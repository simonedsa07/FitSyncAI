import type { Metadata } from 'next';
import { Poppins, Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ThemeInitializer } from '@/components/layout/ThemeInitializer';

const display = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'FitSyncAI — Your AI Fitness Coach',
  description: 'AI-generated workout plans, progress tracking, and a coach in your pocket.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="blush-pink">
      <body className={`${display.variable} ${body.variable} font-body`}>
        <ThemeInitializer />
        {children}
      </body>
    </html>
  );
}