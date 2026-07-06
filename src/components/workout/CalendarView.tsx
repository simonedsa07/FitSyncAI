'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan } from '@/types/workout';
import { DayCard } from './DayCard';
import { todayLabel } from '@/lib/utils';

interface CalendarViewProps {
  plan: WorkoutPlan;
  onComplete: (day: string) => void;
}

export function CalendarView({ plan, onComplete }: CalendarViewProps) {
  const days = plan?.days ?? [];
  const [openDay, setOpenDay] = useState<string | null>(todayLabel());

  if (days.length === 0) {
    return (
      <div className="brutal-card p-6 text-center text-sm text-ink/60">
        This plan has no days yet. Try clicking Regenerate.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
      {days.map((day, i) => (
        <motion.div
          key={day.day}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <DayCard
            day={day}
            open={openDay === day.day}
            onToggle={() => setOpenDay((prev) => (prev === day.day ? null : day.day))}
            onComplete={onComplete}
          />
        </motion.div>
      ))}
    </div>
  );
}