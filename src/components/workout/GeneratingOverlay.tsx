'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Reading your goals…',
  'Balancing training and rest days…',
  'Picking exercises that fit your level…',
  'Estimating calories per session…',
  'Almost ready…',
];

export function GeneratingOverlay() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, MESSAGES.length - 1));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-page/95 backdrop-blur-sm">
      <div className="brutal-card flex flex-col items-center gap-5 px-10 py-12 text-center">
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-ink border-t-transparent"
          style={{ borderTopColor: 'transparent' }}
        />
        <div>
          <h2 className="font-display text-2xl font-extrabold">Generating your plan</h2>
          <p className="mt-2 text-sm text-ink/60">{MESSAGES[index]}</p>
        </div>
      </div>
    </div>
  );
}