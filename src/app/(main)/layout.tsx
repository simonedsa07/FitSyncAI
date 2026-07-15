'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatBox } from '@/components/chat/ChatBox';
import { DarkModeToggle } from '@/components/layout/DarkModeToggle';
import { AppBackground } from '@/components/layout/AppBackground';
import { PlaylistCard } from '@/components/dashboard/PlaylistCard';
import Script from 'next/script';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
      <aside
        aria-label="Music player"
        className="fixed inset-x-4 top-20 z-20 max-h-[calc(100vh-7rem)] overflow-y-auto md:inset-x-auto md:top-auto md:bottom-6 md:right-6 md:w-[22rem]"
      >
        <PlaylistCard />
      </aside>
      <ChatBox />
      <DarkModeToggle />
      <Script
        id="phinite-chatbot"
        src="https://cdn.phinite.ai/website/prod/index.js"
        data-integration-id="3FwzVy6Pu"
        data-company-env="production"
        strategy="afterInteractive"
      />
    </div>
  );
}
