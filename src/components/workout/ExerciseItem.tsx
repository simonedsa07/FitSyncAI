'use client';

import { useState, useEffect } from 'react';
import { Exercise } from '@/types/workout';

export function ExerciseItem({ exercise }: { exercise: Exercise }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setTimeLeft(null);
      // Play a subtle beep if supported
      if (typeof window !== 'undefined') {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          osc.start();
          osc.stop(ctx.currentTime + 0.15);
        } catch (e) {
          console.log('AudioContext not allowed or supported');
        }
      }
    }

    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  function startTimer(seconds: number) {
    setTimeLeft(seconds);
    setTimerActive(true);
  }

  function stopTimer() {
    setTimerActive(false);
    setTimeLeft(null);
  }

  return (
    <div className="flex flex-col border-2 border-ink rounded-xl2 bg-white px-4 py-3 transition-all duration-150 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-ink">{exercise.name}</p>
          <p className="text-xs text-ink/50">~{exercise.est_calories} cal</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="font-bold text-ink/80 text-sm">
            {exercise.duration ?? `${exercise.sets} × ${exercise.reps}`}
          </p>
          {/* Rest Timer Button */}
          {!exercise.duration && (
            <button
              onClick={() => (timerActive ? stopTimer() : startTimer(90))}
              className={`rounded border border-ink px-2 py-0.5 text-[10px] font-bold uppercase transition-all active:scale-95 ${
                timerActive
                  ? 'bg-coral text-white animate-pulse'
                  : 'bg-white text-ink/60 hover:text-ink'
              }`}
            >
              {timerActive ? `⏱ ${timeLeft}s` : '⏱ Rest'}
            </button>
          )}
        </div>
      </div>
      
      {/* Visual countdown overlay helper if active */}
      {timerActive && timeLeft !== null && (
        <div className="mt-2 flex items-center justify-between border-t border-ink/5 pt-2 text-[10px] font-bold uppercase tracking-wider text-ink/50">
          <span>Rest interval active</span>
          <button onClick={stopTimer} className="text-coral hover:underline">
            Skip rest ➔
          </button>
        </div>
      )}
    </div>
  );
}