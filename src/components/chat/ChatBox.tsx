'use client';

import { useState } from 'react';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { sendChatMessage, ChatTurn } from '@/services/chatService';

export function ChatBox() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  async function handleSend(message: string) {
    const next: ChatTurn[] = [...messages, { role: 'user', content: message }];
    setMessages(next);
    setExpanded(true);
    setLoading(true);
    try {
      const reply = await sendChatMessage(next, message);
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setExpanded(false);
  }

  return (
<div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6">      <div className="pointer-events-auto w-full max-w-2xl">
        {expanded && messages.length > 0 && (
          <div className="mb-3 overflow-hidden rounded-card border-2 border-ink bg-white shadow-brutal">
            <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2">
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">FitSync AI</p>
              <button
                onClick={handleClose}
                aria-label="Close chat"
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink text-xs font-bold hover:bg-black/5"
              >
                ✕
              </button>
            </div>
            <div className="max-h-72 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && <MessageBubble role="assistant" content="Thinking…" />}
            </div>
          </div>
        )}

        <div className="relative pt-3">
          <span className="absolute left-7 top-0 z-10 rounded-full border border-ink bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink/50 shadow-sm">
            FitSync AI
          </span>
          <div className="flex h-16 items-center gap-4 rounded-full border-2 border-ink bg-white pl-3 pr-3 shadow-brutal">
            <button
              onClick={() => messages.length > 0 && setExpanded((v) => !v)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink brutal-card-accent"
              aria-label="Toggle chat history"
            >
              💬
            </button>
            <div className="min-w-0 flex-1">
              <ChatInput onSend={handleSend} disabled={loading} bare />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}