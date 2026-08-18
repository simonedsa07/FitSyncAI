'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

export function MessageBubble({ role, content }: { role: 'user' | 'assistant'; content: string }) {
  const isUser = role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-xl2 border-2 border-ink px-4 py-3 text-sm font-medium',
          isUser ? 'bg-ink text-white' : 'bg-accent text-ink shadow-brutal-sm'
        )}
      >
        {isUser ? (
          content
        ) : (
          <div className="prose-chat text-ink">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}