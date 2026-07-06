'use client';

import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  bare?: boolean;
}

export function ChatInput({ onSend, disabled, placeholder, bare = false }: ChatInputProps) {
  const [value, setValue] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        bare
          ? 'flex items-center gap-2'
          : 'flex items-center gap-3 rounded-full border-2 border-ink bg-white px-3 py-2'
      }
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? 'Ask FitSync anything…'}
        className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-ink/40"
        disabled={disabled}
      />
      <button
  type="submit"
  disabled={disabled}
  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink brutal-card-accent disabled:opacity-50"
  aria-label="Send"
>
  💬
</button>
    </form>
  );
}
