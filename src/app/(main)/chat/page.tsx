'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import { sendChatMessage, ChatTurn } from '@/services/chatService';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatTurn[]>([
    { role: 'assistant', content: "Hey! I'm FitSync AI. Ask me anything about your training, nutrition, or recovery." },
  ]);
  const [loading, setLoading] = useState(false);

  async function handleSend(message: string) {
    const next: ChatTurn[] = [...messages, { role: 'user', content: message }];
    setMessages(next);
    setLoading(true);
    try {
      const reply = await sendChatMessage(next, message);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-4xl font-extrabold">Coach Chat</h1>
      <Card className="flex h-[60vh] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
          {loading && <MessageBubble role="assistant" content="Thinking…" />}
        </div>
        <div className="mt-4">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </Card>
    </div>
  );
}
