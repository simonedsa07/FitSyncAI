'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useWorkout } from '@/hooks/useWorkout';
import { WorkoutCard } from '@/components/dashboard/WorkoutCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import Link from 'next/link';
import { todayLabel, calculateWeeklyCalorieTarget } from '@/lib/utils';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { plan, completeDay } = useWorkout();

  const weekDays = plan?.days ?? [];
  const today = weekDays.find((d) => d.day === todayLabel()) ?? null;
  const completedCount = weekDays.filter((d) => d.completed && !d.is_rest).length;
  const plannedCount = weekDays.filter((d) => !d.is_rest).length;
  const caloriesBurned = weekDays
    .filter((d) => d.completed)
    .reduce((sum, d) => sum + d.est_calories, 0);

  const weeklyTarget = profile ? calculateWeeklyCalorieTarget(profile) : null;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Welcome back</p>
        <h1 className="font-display text-4xl font-extrabold">
          Hey, {profile?.name ?? 'there'}
          <span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <p className="mt-1 text-ink/70">Let&apos;s crush today&apos;s session 💪</p>
      </motion.div>

      <div className="mt-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          whileHover={{ y: -3 }}
        >
          <WorkoutCard day={today} onMarkDone={() => today && completeDay(today.day)} />
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          <StatsCard key="workouts" icon="↗" label="Workouts · Week" value={completedCount} footer={`of ${plannedCount} planned`} />,
          <StatsCard
            key="calories"
            icon="🔥"
            label="Calories · Week"
            value={caloriesBurned}
            footer={weeklyTarget ? `Target: ${weeklyTarget.toLocaleString()} kcal/wk` : 'Add height/weight/age for a target'}
          />,
          <StatsCard
            key="weight"
            icon="📅"
            label="Current Weight"
            value={profile?.weight_kg ?? '—'}
            suffix="kg"
            footer={
              <Link href="/progress" className="font-bold underline">
                Log weight →
              </Link>
            }
          />,
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            whileHover={{ y: -3 }}
          >
            {card}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
