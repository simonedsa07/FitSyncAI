export interface PhiniteResult {
  raw: string;
  spotifyPlaylistUrl: string | null;
  spotifyPlaylistId: string | null;
  otherLink: string | null;
}

export async function askMusicAgent(message: string): Promise<PhiniteResult> {
  const res = await fetch('/api/phinite/generate-playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error ?? `Failed to reach music agent (HTTP ${res.status})`);
  }
  return body;
}