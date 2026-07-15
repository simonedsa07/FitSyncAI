'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/useThemeStore';
import { THEMES } from '@/themes/colors';
import { useAuth } from '@/hooks/useAuth';
import { LogoMark } from './LogoMark';

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/workout', label: 'Plan' },
  { href: '/progress', label: 'Progress' },
  { href: '/profile', label: 'Profile' },
];

function PaletteIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.2 0-.9.7-1.5 1.5-1.5H16a4 4 0 0 0 4-4c0-4.4-3.6-8-8-8Z" />
      <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="9.5" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="14" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.2" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H9" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useThemeStore();
  const [pickerOpen, setPickerOpen] = useState(false);
  const { logout } = useAuth();

  const iconButtonClass =
    'flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-white shadow-brutal-sm transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none';

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-white/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink brutal-card-accent text-ink"
          >
            <LogoMark size={20} />
          </motion.div>
          <span className="font-display text-xl font-extrabold">
            FitSync<span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
        </Link>

        <div className="relative hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="relative z-10 px-4 py-2">
                {active && (
                  <motion.div
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full border-2 border-ink shadow-brutal-sm"
                    style={{ backgroundColor: 'var(--accent)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className={cn('text-sm font-semibold', active ? 'text-ink' : 'text-ink/60 hover:text-ink')}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setPickerOpen((v) => !v)}
              className={cn(iconButtonClass, 'hover:[background-color:color-mix(in_srgb,var(--accent)_45%,white)]')}
              aria-label="Change theme"
            >
              <PaletteIcon />
            </motion.button>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-20 w-44 space-y-1 rounded-xl2 border-2 border-ink bg-white p-2 shadow-brutal"
              >
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setPickerOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold hover:bg-black/5"
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-ink"
                      style={{ backgroundColor: t.swatch }}
                    />
                    {t.label}
                    {theme === t.id && <span className="ml-auto">•</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={logout}
            className={cn(iconButtonClass, 'hover:[background-color:color-mix(in_srgb,var(--accent)_45%,white)]')}
            aria-label="Log out"
          >
            <LogoutIcon />
          </motion.button>
        </div>
      </nav>
    </header>
  );
}