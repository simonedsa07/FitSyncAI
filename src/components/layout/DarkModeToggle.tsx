'use client';

import { useDarkModeStore } from '@/store/useDarkModeStore';

export function DarkModeToggle() {
  const { dark, toggle } = useDarkModeStore();

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
className="fixed bottom-24 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-brutal transition-transform hover:-translate-y-0.5 md:bottom-6 md:right-6"    >
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.5A8.5 8.5 0 1 1 11.5 3 6.5 6.5 0 0 0 21 12.5Z" />
        </svg>
      )}
    </button>
  );
}