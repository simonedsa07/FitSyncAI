'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatBox } from '@/components/chat/ChatBox';
import { DarkModeToggle } from '@/components/layout/DarkModeToggle';
import { AppBackground } from '@/components/layout/AppBackground';
import { PlaylistCard } from '@/components/dashboard/PlaylistCard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [musicOpen, setMusicOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page pb-32">
      <AppBackground />
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Sidebar />
      <motion.aside
        aria-label="Music player"
        aria-hidden={!musicOpen}
        animate={musicOpen ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className={`fixed inset-x-4 bottom-[13rem] z-40 max-h-[calc(100vh-16rem)] overflow-y-auto md:inset-x-auto md:bottom-20 md:left-6 md:w-[22rem] md:max-h-[calc(100vh-7rem)] ${
          musicOpen ? '' : 'pointer-events-none'
        }`}
      >
        <PlaylistCard />
      </motion.aside>
      <button
        type="button"
        onClick={() => setMusicOpen((open) => !open)}
        aria-label={musicOpen ? 'Close music player' : 'Open music player'}
        aria-expanded={musicOpen}
        className="fixed bottom-[9.5rem] left-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-white text-ink shadow-brutal transition-transform hover:-translate-y-0.5 md:bottom-6 md:left-6"
      >
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l11-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="17" cy="16" r="3" />
        </svg>
      </button>
      <ChatBox />
      <DarkModeToggle />
    </div>
  );
}
