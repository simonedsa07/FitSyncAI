'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/useThemeStore';

// Mounted once in the root layout so the saved theme applies immediately
// on every route (auth, onboarding, main app) — not just pages with a Navbar.
export function ThemeInitializer() {
  useEffect(() => {
    const current = useThemeStore.getState().theme;
    useThemeStore.getState().setTheme(current);
  }, []);

  return null;
}