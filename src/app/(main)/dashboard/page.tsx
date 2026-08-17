'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/useUserStore';
import { useWorkout } from '@/hooks/useWorkout';
import { WorkoutCard } from '@/components/dashboard/WorkoutCard';
import { StatsCard } from '@/components/dashboard/StatsCard';
import Link from 'next/link';
import { todayLabel, calculateWeeklyCalorieTarget } from '@/lib/utils';
import { supabase } from '@/lib/supabaseClient';

import { Card } from '@/components/ui/Card';

function calculateStreak(logs: { completed_at: string }[]): number {
  if (logs.length === 0) return 0;
  
  const dates = Array.from(
    new Set(
      logs.map((l) => new Date(l.completed_at).toDateString())
    )
  )
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  let expectedDate = today;

  const hasWorkoutToday = dates.some((d) => d.toDateString() === today.toDateString());
  if (!hasWorkoutToday) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const hasWorkoutYesterday = dates.some((d) => d.toDateString() === yesterday.toDateString());
    if (!hasWorkoutYesterday) {
      return 0;
    }
    expectedDate = yesterday;
  }

  for (const date of dates) {
    date.setHours(0, 0, 0, 0);
    if (date.toDateString() === expectedDate.toDateString()) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else if (date.getTime() < expectedDate.getTime()) {
      break;
    }
  }

  return streak;
}

export default function DashboardPage() {
  const { profile } = useAuth();
  // Subscribe directly to days_per_week so the card re-renders the moment
  // the user saves Profile Settings — no page reload needed.
  const daysPerWeek = useUserStore((s) => s.profile?.days_per_week);
  const { plan, completeDay } = useWorkout();

  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('workout_logs')
      .select('completed_at')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        if (data) {
          setStreakCount(calculateStreak(data));
        }
      });
  }, [profile?.id]);

  const weekDays = plan?.days ?? [];
  const today = weekDays.find((d) => d.day === todayLabel()) ?? null;
  const completedCount = weekDays.filter((d) => d.completed && !d.is_rest).length;
  // Use the profile setting as the authoritative target; fall back to plan days
  // only when profile hasn't loaded yet.
  const targetDays = daysPerWeek ?? weekDays.filter((d) => !d.is_rest).length;
  const caloriesBurned = weekDays
    .filter((d) => d.completed)
    .reduce((sum, d) => sum + d.est_calories, 0);

  const weeklyTarget = profile ? calculateWeeklyCalorieTarget(profile) : null;

  const workoutsValue = completedCount > 0 ? completedCount : (
    <div className="flex items-center gap-3 mt-1">
      <svg className="h-10 w-10 shrink-0 transform -rotate-90 text-coral" viewBox="0 0 36 36">
        <path
          className="text-ink/10"
          strokeWidth="3.5"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-coral animate-pulse"
          strokeWidth="3.5"
          strokeDasharray="0, 100"
          strokeLinecap="round"
          stroke="currentColor"
          fill="none"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-base font-bold text-ink leading-tight">Start active!</span>
        <span className="text-[11px] font-semibold text-ink/50 leading-none mt-1">Get your first workout in</span>
      </div>
    </div>
  );

  const caloriesValue = caloriesBurned > 0 ? caloriesBurned : (
    <div className="flex items-center gap-3 mt-1">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-ink/20 text-lg">
        🔥
      </div>
      <div className="flex flex-col">
        <span className="text-base font-bold text-ink leading-tight">0 kcal burned</span>
        <span className="text-[11px] font-semibold text-ink/50 leading-none mt-1">Ready to crush today&apos;s goals?</span>
      </div>
    </div>
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Welcome back</p>
          <h1 className="font-display text-4xl font-extrabold">
            Hey, {profile?.name ?? 'there'}
            <span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p className="mt-1 text-ink/70">Let&apos;s crush today&apos;s session 💪</p>
        </div>
        {streakCount > 0 && (
          <div className="flex items-center gap-2 rounded-full border-2 border-ink bg-[#F2679B]/15 px-4 py-2 text-sm font-extrabold text-[#F2679B] transition-all hover:scale-105 shadow-brutal-sm">
            <span>🔥</span>
            <span>{streakCount} Day Streak</span>
          </div>
        )}
      </motion.div>

      {/* Bento Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Today's Workout: 2x2 Span on Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="md:col-span-2 md:row-span-2 h-full"
        >
          <WorkoutCard day={today} onMarkDone={() => today && completeDay(today.day)} />
        </motion.div>

        {/* Workouts Stat Tile: 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <StatsCard key="workouts" icon="↗" label="Workouts · Week" value={workoutsValue} footer={`of ${targetDays} planned`} />
        </motion.div>

        {/* Calories Stat Tile: 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.18 }}
        >
          <StatsCard
            key="calories"
            icon="🔥"
            label="Calories · Week"
            value={caloriesValue}
            footer={weeklyTarget ? `Target: ${weeklyTarget.toLocaleString()} kcal/wk` : 'Add details for target'}
          />
        </motion.div>

        {/* AI Insight Tile: 2x1 Span */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.26 }}
          className="md:col-span-2"
        >
          <Card className="bg-[#9B8CF0]/15 border-2 border-ink h-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-[#9B8CF0] mb-3">
              <span>🔮</span>
              <span>AI Coaching Insight</span>
            </div>
            <p className="text-sm font-semibold text-ink leading-relaxed">
              {profile?.goal === 'fat_loss' ? (
                "Excellent work! You've logged activities that align with your deficit target. Consider adding 10 mins of walking to accelerate fat mobilization today."
              ) : profile?.goal === 'muscle_gain' ? (
                "Your workout volume is looking strong this week. Remember to prioritize sleep tonight for muscular repair, and ensure you hits your 1.8g/kg protein target!"
              ) : (
                "You are holding a solid training pace. Keep this consistency up to build a lasting active routine. Remember to drink 3L of water on training days!"
              )}
            </p>
          </Card>
        </motion.div>

        {/* Weight Stat Tile: 1x1 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.32 }}
        >
          <StatsCard
            key="weight"
            icon="📅"
            label="Current Weight"
            value={profile?.weight_kg ?? '—'}
            suffix="kg"
            footer={
              <Link href="/progress" className="font-bold underline text-xs">
                Log weight →
              </Link>
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
