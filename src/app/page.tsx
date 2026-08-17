'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AppBackground } from '@/components/layout/AppBackground';
import { DarkModeToggle } from '@/components/layout/DarkModeToggle';
import { FadeIn } from '@/components/landing/FadeIn';
import { TiltCard } from '@/components/landing/TiltCard';
import { LogoMark } from '@/components/layout/LogoMark';

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Generated Plans',
    desc: 'A weekly workout plan built around your goal, activity level, and BMI — regenerate anytime.',
    color: '#9B8CF0', // Lavender (AI content)
  },
  {
    icon: '💬',
    title: 'Coach That Talks Back',
    desc: 'Ask FitSync AI anything, mid-workout or mid-doubt. Real answers, not a static FAQ.',
    color: '#9B8CF0', // Lavender (AI content)
  },
  {
    icon: '📈',
    title: 'Progress You Can See',
    desc: 'Weight trend lines, weekly consistency bars — the shape of your effort over time.',
    color: '#4A9FE8', // Sky Focus (Data Viz)
  },
  {
    icon: '🎵',
    title: 'Spotify-Matched Playlists',
    desc: 'Connect Spotify and get a playlist generated to match your workout intensity.',
    color: '#2BB893', // Mint Spark (Completed/Trends)
  },
  {
    icon: '🎨',
    title: 'Made It Yours',
    desc: 'Four accent themes, light or dark — pick a look and it stays exactly how you left it.',
    color: '#F2679B', // Bubblegum Pink (Gamification)
  },
  {
    icon: '🔒',
    title: 'Actually Private',
    desc: 'Row-level security on every table. Your data is yours — not visible to any other user.',
    color: '#4A9FE8', // Sky Focus
    comingSoon: true,
  },
];

const STEPS = [
  { n: '01', title: 'Tell us your goal', desc: 'Age, body metrics, activity level, days per week — 60 seconds, six taps.' },
  { n: '02', title: 'Get your plan', desc: 'A full week, built for you — full body, cardio, and rest days balanced correctly.' },
  { n: '03', title: 'Train, log, repeat', desc: 'Mark days done, log your weight, watch the trend line move in your favor.' },
];

const MARQUEE_ITEMS = [
  'AI Workout Plans', 'Coach Chat', 'Progress Tracking', 'Spotify Sync',
  'Dark Mode', '4 Themes', 'Weekly Regeneration', 'Weight Trends',
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-ink">
      <AppBackground />
      {/* ---------- Sticky nav ---------- */}
      <motion.header
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-colors"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
          borderBottomColor: scrolled ? 'rgba(44,44,42,1)' : 'rgba(44,44,42,0)',
        }}
        style={{ borderBottomWidth: 2, borderBottomStyle: 'solid' }}
        transition={{ duration: 0.25 }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl2 border-2 border-ink brutal-card-accent text-ink">
              <LogoMark size={20} />
            </div>
            <span className="font-display text-lg font-extrabold">
              FitSync<span style={{ color: 'var(--accent)' }}>AI</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-ink/70 hover:text-ink">
              Sign in
            </Link>
            <Link href="/signup" className="btn-pill-accent text-sm">
              Get started
            </Link>
          </div>
        </nav>
      </motion.header>

      {/* ---------- Hero ---------- */}
      <section className="mx-auto max-w-6xl px-6 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-4 py-1.5 shadow-brutal-sm"
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: '#2BB893' }} />
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                AI-Powered Personal Training
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="font-display text-5xl font-extrabold leading-[1.1] sm:text-6xl lg:text-7xl"
            >
              Your workout plan,{' '}
              <span className="relative inline-block">
                <span className="relative z-10" style={{ color: 'var(--accent)' }}>
                  perfectly synced.
                </span>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="max-w-xl text-lg font-medium text-ink/70 sm:text-xl"
            >
              FitSync AI builds a custom workout program around your body, schedule, and goals.
              Adapt on the fly, track real progress, and chat with your AI coach anytime.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link href="/signup" className="btn-pill-accent text-base">
                Build your plan free →
              </Link>
              <Link href="/login" className="btn-pill-ghost text-base">
                Sign in
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="flex items-center gap-6 pt-4 text-xs font-semibold text-ink/60"
            >
              <span className="flex items-center gap-1.5">✓ Instant plan generation</span>
              <span className="flex items-center gap-1.5">✓ No credit card required</span>
            </motion.div>
          </div>

          {/* Hero visual card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative lg:col-span-5"
          >
            <TiltCard>
              <div className="brutal-card p-6 shadow-brutal-lg">
                <div className="flex items-center justify-between border-b-2 border-ink pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl2 border-2 border-ink bg-[#9B8CF0] text-ink">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-ink">FitSync AI Coach</h3>
                      <p className="text-xs text-ink/60">Active Now</p>
                    </div>
                  </div>
                  <span className="rounded-full border-2 border-ink bg-[#F2679B] px-3 py-1 text-xs font-bold text-white shadow-brutal-sm">
                    🔥 5 Day Streak
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="rounded-xl2 border-2 border-ink p-3 text-xs font-medium bg-[#9B8CF0]/15">
                    <p className="font-bold text-ink">Today&apos;s Workout</p>
                    <p className="mt-1 text-ink/80">Upper Body Power • 45 min • 4 exercises</p>
                  </div>

                  <div className="space-y-2">
                    {[
                      { name: 'Bench Press', sets: '4 sets × 8 reps', done: true },
                      { name: 'Incline Dumbbell Press', sets: '3 sets × 10 reps', done: true },
                      { name: 'Cable Flyes', sets: '3 sets × 12 reps', done: false },
                    ].map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-lg border-2 border-ink bg-white p-2.5 text-xs"
                      >
                        <div>
                          <span className="font-bold text-ink">{ex.name}</span>
                          <span className="ml-2 text-ink/60">{ex.sets}</span>
                        </div>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink font-bold text-[10px] ${
                            ex.done ? 'bg-[#2BB893] text-white' : 'bg-white text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="border-y-2 border-ink bg-[#FCFBF7] py-5 overflow-hidden">
        <div className="flex animate-[marquee_28s_linear_infinite] gap-6 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-block rounded-full border-2 border-ink bg-white px-4 py-1.5 font-display text-sm font-extrabold text-ink transition-transform hover:-translate-y-0.5"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Features ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-28 bg-[#FCFBF7]">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Features</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            Everything you need, none of the fluff.
          </h2>
        </FadeIn>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="brutal-card h-full p-6 relative bg-white"
              >
                {f.comingSoon && (
                  <span className="absolute top-4 right-4 rounded-full border border-ink bg-[#FFF9E6] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink">
                    Coming Soon
                  </span>
                )}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl2 border-2 border-ink text-xl text-white"
                  style={{ backgroundColor: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-extrabold">{f.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{f.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section className="bg-white border-y-2 border-ink px-6 py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="text-xs font-bold uppercase tracking-wide text-ink/50">How it works</p>
            <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
              Three steps. That&apos;s it.
            </h2>
          </FadeIn>

          <div className="relative mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-ink/15 md:block" />
            {STEPS.map((s, i) => (
              <FadeIn key={s.n} delay={i * 0.15}>
                <div className="relative">
                  <div
                    className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-extrabold"
                    style={{ backgroundColor: 'var(--accent)', color: '#14121A' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Product Preview Section ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-28 bg-[#FCFBF7]">
        <FadeIn className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Preview</p>
          <h2 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl">
            Clean layout. Peak performance.
          </h2>
          <p className="mt-4 text-ink/70">
            A real-time overview of your training week, active targets, and AI-coach conversations.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} className="mt-14">
          <div className="brutal-card overflow-hidden bg-[#FCFBF7] p-0 shadow-lg border-2 border-ink">
            {/* Header bar */}
            <div className="flex items-center gap-2 border-b-2 border-ink bg-white px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full border border-ink bg-[#ef4444]" />
                <span className="h-3 w-3 rounded-full border border-ink bg-[#f59e0b]" />
                <span className="h-3 w-3 rounded-full border border-ink bg-[#22c55e]" />
              </div>
              <div className="mx-auto flex h-6 w-72 items-center justify-center rounded border border-ink bg-[#FCFBF7] px-2 text-[10px] font-semibold text-ink/50">
                fitsyncai.com/dashboard
              </div>
            </div>
            {/* Mock layout content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 min-h-[360px] bg-white">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-3 border-r-2 border-ink/10 pr-6">
                <div className="h-8 rounded-xl2 bg-[#D85A30]/10 border-2 border-ink flex items-center px-3 text-xs font-bold text-ink">🏠 Dashboard</div>
                <div className="h-8 rounded-xl2 flex items-center px-3 text-xs font-semibold text-ink/60">📅 Workout Plan</div>
                <div className="h-8 rounded-xl2 flex items-center px-3 text-xs font-semibold text-ink/60">📈 Progress</div>
                <div className="h-8 rounded-xl2 flex items-center px-3 text-xs font-semibold text-ink/60">👤 Profile</div>
              </div>
              {/* Grid content */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 border-2 border-ink rounded-card bg-[#D85A30]/5 p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Today's Session</span>
                      <h4 className="font-display text-lg font-extrabold mt-1">Legs & Shoulders</h4>
                    </div>
                    <span className="rounded-full bg-[#D85A30] text-white px-3 py-0.5 text-[9px] font-bold uppercase">Active</span>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center bg-white border border-ink/20 p-2.5 rounded-xl2 text-xs font-semibold">
                      <span>• Squats (3 x 10)</span>
                      <span className="text-ink/60">60 kg</span>
                    </div>
                    <div className="flex justify-between items-center bg-white border border-ink/20 p-2.5 rounded-xl2 text-xs font-semibold">
                      <span>• Overhead Press (3 x 8)</span>
                      <span className="text-ink/60">40 kg</span>
                    </div>
                  </div>
                </div>
                <div className="border-2 border-ink rounded-card bg-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Workouts</span>
                  <p className="font-display text-2xl font-extrabold mt-1">4 of 5</p>
                </div>
                <div className="border-2 border-ink rounded-card bg-white p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">Calorie Target</span>
                  <p className="font-display text-2xl font-extrabold mt-1">2,450 kcal</p>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden px-6 py-28">
        <FadeIn className="relative mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
            Ready to sync your fitness?
          </h2>
          <p className="mt-4 text-ink/70">
            No credit card. No fluff. Just a plan built for you, in under a minute.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/signup" className="btn-pill-accent">
              Get started free
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t-2 border-ink bg-white px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-display text-sm font-extrabold">
            FitSync<span style={{ color: 'var(--accent)' }}>AI</span>
          </span>
          <p className="text-xs text-ink/50">© {new Date().getFullYear()} FitSyncAI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}