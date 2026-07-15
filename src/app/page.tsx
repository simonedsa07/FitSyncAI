'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AnimatedBlob } from '@/components/landing/AnimatedBlob';
import { FadeIn } from '@/components/landing/FadeIn';
import { TiltCard } from '@/components/landing/TiltCard';
import { LogoMark } from '@/components/layout/LogoMark';

const FEATURES = [
  {
    icon: '🧠',
    title: 'AI-Generated Plans',
    desc: 'A weekly workout plan built around your goal, activity level, and BMI — regenerate anytime.',
  },
  {
    icon: '💬',
    title: 'Coach That Talks Back',
    desc: 'Ask FitSync AI anything, mid-workout or mid-doubt. Real answers, not a static FAQ.',
  },
  {
    icon: '📈',
    title: 'Progress You Can See',
    desc: 'Weight trend lines, weekly consistency bars — the shape of your effort over time.',
  },
  {
    icon: '🎵',
    title: 'Spotify-Matched Playlists',
    desc: 'Connect Spotify and get a playlist generated to match your workout intensity.',
  },
  {
    icon: '🎨',
    title: 'Made It Yours',
    desc: 'Five accent themes, light or dark — pick a look and it stays exactly how you left it.',
  },
  {
    icon: '🔒',
    title: 'Actually Private',
    desc: 'Row-level security on every table. Your data is yours — not visible to any other user.',
  },
];

const STEPS = [
  { n: '01', title: 'Tell us your goal', desc: 'Age, body metrics, activity level, days per week — 60 seconds, six taps.' },
  { n: '02', title: 'Get your plan', desc: 'A full week, built for you — full body, cardio, and rest days balanced correctly.' },
  { n: '03', title: 'Train, log, repeat', desc: 'Mark days done, log your weight, watch the trend line move in your favor.' },
];

const MARQUEE_ITEMS = [
  'AI Workout Plans', 'Coach Chat', 'Progress Tracking', 'Spotify Sync',
  'Dark Mode', '5 Themes', 'Weekly Regeneration', 'Weight Trends',
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
<main data-force-light className="relative overflow-hidden">      {/* ---------- Sticky nav ---------- */}
      <motion.header
        className="fixed inset-x-0 top-0 z-50 transition-colors"
        animate={{
          backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0)',
          borderBottomColor: scrolled ? 'rgba(20,18,26,1)' : 'rgba(20,18,26,0)',
        }}
        style={{ backdropFilter: scrolled ? 'blur(10px)' : 'none', borderBottomWidth: 2, borderBottomStyle: 'solid' }}
        transition={{ duration: 0.25 }}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink brutal-card-accent text-ink">
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
      <section className="relative flex min-h-screen items-center px-6 pt-24">
        <AnimatedBlob className="left-[-10%] top-[10%] h-72 w-72" color="var(--accent)" duration={20} />
        <AnimatedBlob className="right-[-5%] top-[35%] h-96 w-96" color="var(--accent-light)" duration={26} />
        <AnimatedBlob className="left-[20%] bottom-[-10%] h-80 w-80" color="var(--accent)" duration={22} />

        <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide shadow-brutal-sm"
            >
              ✨ AI-powered fitness, done right
            </motion.span>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08 } },
              }}
              className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl"
            >
              {['Your plan.', 'Your pace.', 'Synced by AI.'].map((line, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] } },
                  }}
                  className="block"
                >
                  {i === 2 ? (
                    <>
                      Synced by <span style={{ color: 'var(--accent)' }}>AI</span>.
                    </>
                  ) : (
                    line
                  )}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 max-w-md text-lg text-ink/70"
            >
              AI-generated workout plans, a coach that actually talks back, and playlists that
              match your intensity — all in one place, built around your goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link href="/signup" className="btn-pill-accent">
                Get started free
              </Link>
              <Link href="/login" className="btn-pill-ghost">
                Sign in
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="hidden lg:block"
          >
            <TiltCard>
              <div className="brutal-card p-6" style={{ backgroundColor: 'var(--accent)' }}>
                <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(20,18,26,0.6)' }}>
                  Today · Tue
                </p>
                <h3 className="font-display text-2xl font-extrabold" style={{ color: '#14121A' }}>
                  Cardio Day
                </h3>
                <p className="mt-1 text-sm" style={{ color: 'rgba(20,18,26,0.7)' }}>
                  4 exercises · ~440 cal · Intermediate
                </p>
                <div className="mt-5 space-y-2">
                  {['Jog / Run', 'Jump Rope', 'High Knees', 'Mountain Climbers'].map((name) => (
                    <div
                      key={name}
                      className="flex items-center justify-between rounded-xl2 border-2 border-ink bg-white px-4 py-2.5 text-sm font-semibold"
                    >
                      <span>{name}</span>
                      <span className="text-ink/50">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ---------- Marquee ---------- */}
      <div className="border-y-2 border-ink bg-white py-4">
        <div className="flex animate-[marquee_28s_linear_infinite] gap-10 whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="font-display text-lg font-extrabold text-ink/20">
              {item} ✦
            </span>
          ))}
        </div>
      </div>

      {/* ---------- Features ---------- */}
      <section className="mx-auto max-w-6xl px-6 py-28">
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
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="brutal-card h-full p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-ink brutal-card-accent text-xl">
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
                    className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink font-display text-sm font-extrabold shadow-brutal-sm"
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

      {/* ---------- CTA ---------- */}
      <section className="relative overflow-hidden px-6 py-28">
        <AnimatedBlob className="left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2" color="var(--accent)" duration={24} />
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