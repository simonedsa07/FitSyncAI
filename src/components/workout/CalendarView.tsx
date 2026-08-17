'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { WorkoutPlan } from '@/types/workout';
import { DayCard } from './DayCard';
import { todayLabel, cn } from '@/lib/utils';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 auto-rows-max items-start">
      {days.map((day, i) => {
        const isOpen = openDay === day.day;
        return (
          <motion.div
            key={day.day}
            layout
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            className={cn(
              'transition-all duration-300',
              isOpen ? 'md:col-span-2 md:row-span-2' : 'col-span-1'
            )}
          >
            <DayCard
              day={day}
              open={isOpen}
              onToggle={() => setOpenDay((prev) => (prev === day.day ? null : day.day))}
              onComplete={onComplete}
            />
          </motion.div>
        );
      })}
    </div>
  );
}