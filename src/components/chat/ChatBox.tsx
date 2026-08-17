'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { sendChatMessage, ChatTurn } from '@/services/chatService';

export function ChatBox() {
  const [messages, setMessages] = useState<ChatTurn[]>([
    { role: 'assistant', content: "Hey! I'm FitSync AI. Ask me anything about your training, nutrition, or recovery." },
  ]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

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
    /* FAB anchor — bottom-right, clears the mobile tab bar on small screens */
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">

      {/* ── Expanded chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex w-[min(92vw,22rem)] flex-col overflow-hidden rounded-card border-2 border-ink bg-white shadow-brutal"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-ink px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink brutal-card-accent text-sm">
                  💬
                </span>
                <p className="text-xs font-bold uppercase tracking-wide text-ink/60">FitSync AI</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink text-xs font-bold hover:bg-black/5 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Message list */}
            <div className="max-h-72 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <MessageBubble key={i} role={m.role} content={m.content} />
              ))}
              {loading && <MessageBubble role="assistant" content="Thinking…" />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t-2 border-ink px-3 py-2">
              <ChatInput onSend={handleSend} disabled={loading} bare />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB button ── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={open}
        className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-white shadow-brutal transition-colors hover:brutal-card-accent"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-lg font-bold"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-xl"
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>
        {/* Unread dot — shown when chat has new AI reply and panel is closed */}
        {!open && messages.length > 1 && (
          <span className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
        )}
      </motion.button>
    </div>
  );
}