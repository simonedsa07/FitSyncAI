'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { sendChatMessage, ChatTurn } from '@/services/chatService';

export function ChatBox() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (expanded) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, expanded]);

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
    /*
     * Sits above the mobile tab bar (bottom-16 = 64 px) on small screens.
     * On desktop there is no tab bar so bottom-4 is fine.
     * The main content area has matching padding-bottom set in layout.tsx
     * so no card content is ever hidden beneath this bar.
     */
    <div className="pointer-events-none fixed inset-x-0 bottom-16 z-40 flex justify-center px-4 md:bottom-4">
      <div className="pointer-events-auto w-full max-w-2xl">

        {/* ── Chat history panel ── */}
        <AnimatePresence>
          {expanded && messages.length > 0 && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
              className="mb-3 overflow-hidden rounded-card border-2 border-ink bg-white"
            >
              <div className="flex items-center justify-between border-b-2 border-ink bg-[#9B8CF0]/20 px-4 py-2">
                <p className="text-xs font-bold uppercase tracking-wide text-ink">FitSync AI</p>
                <button
                  onClick={handleClose}
                  aria-label="Close chat"
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink text-xs font-bold hover:bg-black/5 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="max-h-72 space-y-3 overflow-y-auto p-4">
                {messages.map((m, i) => (
                  <MessageBubble key={i} role={m.role} content={m.content} />
                ))}
                {loading && <MessageBubble role="assistant" content="Thinking…" />}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* ── Input bar ── */}
        <div className="relative pt-3">
          <span className="absolute left-7 top-0 z-10 rounded-full border-2 border-ink bg-[#9B8CF0] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink shadow-sm">
            FitSync AI
          </span>
          <div className="flex h-16 items-center gap-4 rounded-full border-2 border-ink bg-white pl-3 pr-3">
            <button
              onClick={() => messages.length > 0 && setExpanded((v) => !v)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-[#9B8CF0] text-ink hover:-translate-y-0.5 active:translate-y-0 transition-all"
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