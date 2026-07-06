export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendChatMessage(history: ChatTurn[], message: string) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return data?.error ?? data?.reply ?? `Request failed (HTTP ${res.status}). Check the server logs.`;
    }

    return data?.reply ?? "Sorry, I couldn't process that. Try again.";
  } catch (err) {
    console.error('Chat request failed:', err);
    return err instanceof Error
      ? `Network error: ${err.message}`
      : "Couldn't reach the server. Check your connection.";
  }
}