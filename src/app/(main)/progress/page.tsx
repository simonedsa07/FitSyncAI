'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { formatDate, cn } from '@/lib/utils';
import type { WorkoutDay } from '@/types/workout';

interface WeightPoint {
  date: string;
  weight: number;
}

interface WorkoutCountPoint {
  day: string;
  count: number;
}

interface CalorieBurnPoint {
  day: string;
  calories: number;
}

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

function Heatmap({ logs }: { logs: { completed_at: string }[] }) {
  const totalDays = 12 * 7; // Last 12 weeks
  const today = new Date();
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - totalDays + 1);

  const gridDays = Array.from({ length: totalDays }).map((_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const isCompleted = logs.some(
      (l) => new Date(l.completed_at).toDateString() === d.toDateString()
    );
    return { date: d, completed: isCompleted };
  });

  const weeks = [];
  for (let i = 0; i < gridDays.length; i += 7) {
    weeks.push(gridDays.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-none justify-center">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((d, dIdx) => (
              <div
                key={dIdx}
                className={cn(
                  'h-3 w-3 rounded-sm border transition-colors',
                  d.completed
                    ? 'bg-[#1D9E75] border-[#1D9E75]'
                    : 'bg-white dark:bg-[#22201C] border-ink/10'
                )}
                title={`${d.date.toDateString()}: ${d.completed ? 'Completed' : 'No workout'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center text-[10px] font-bold text-ink/40 uppercase tracking-wide px-2">
        <span>12 weeks ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const { profile } = useAuth();
  const [weightInput, setWeightInput] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightPoint[]>([]);
  const [calorieHistory, setCalorieHistory] = useState<CalorieBurnPoint[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [rawLogs, setRawLogs] = useState<{ completed_at: string }[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    loadProgress();
  }, [profile?.id]);

  async function loadProgress() {
    if (!profile) return;

    // 1. Fetch weight logs
    const { data: weights, error: weightsError } = await supabase
      .from('weight_logs')
      .select('logged_at, weight_kg')
      .eq('user_id', profile.id)
      .order('logged_at', { ascending: true });

    if (weightsError) {
      console.error('Failed to load weight logs:', weightsError.message);
    }

    setWeightHistory(
      (weights ?? []).map((w) => ({ date: formatDate(w.logged_at), weight: w.weight_kg }))
    );

    // 2. Fetch workout logs
    const { data: logs, count, error: logsError } = await supabase
      .from('workout_logs')
      .select('completed_at, day')
      .eq('user_id', profile.id);

    if (logsError) {
      console.error('Failed to load workout logs:', logsError.message);
    }

    const safeLogs = logs ?? [];
    setRawLogs(safeLogs);
    setTotalWorkouts(count ?? 0);
    setStreakCount(calculateStreak(safeLogs));

    // 3. Fetch active plan to calculate calorie burn values
    const { data: plan } = await supabase
      .from('workout_plans')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const planDays: WorkoutDay[] = plan?.days ?? [];

    // Construct calorie history for the last 7 days
    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const completedLogs = safeLogs.filter(
        (l) => new Date(l.completed_at).toDateString() === d.toDateString()
      );
      
      let calories = 0;
      if (completedLogs.length > 0) {
        // sum up calories of matching completed days in the plan
        completedLogs.forEach((log) => {
          const match = planDays.find((pd) => pd.day.toUpperCase() === log.day?.toUpperCase());
          calories += match?.est_calories ?? 450; // Fallback to 450 kcal
        });
      }
      return { day: label, calories };
    });

    setCalorieHistory(last7);
  }

  async function logWeight() {
    if (!profile || !weightInput) return;
    setSaving(true);
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight_kg: Number(weightInput) }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert('Could not save weight: ' + (body.error ?? `HTTP ${res.status}`));
        return;
      }

      setWeightInput('');
      await loadProgress();
    } catch (err) {
      alert('Could not save weight: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  }

  const currentWeight = weightHistory.at(-1)?.weight ?? profile?.weight_kg ?? null;

  // Streak badge system
  let badgeText = 'No active streak. Start today! 🌱';
  if (streakCount >= 5) {
    badgeText = 'Elite Athlete! 👑';
  } else if (streakCount >= 3) {
    badgeText = 'On Fire! 🔥';
  } else if (streakCount >= 1) {
    badgeText = 'Consistent Start! 🚀';
  }

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 font-display text-4xl font-extrabold"
      >
        Your Progress
      </motion.h1>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Streak Counter Badge card - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="col-span-1"
        >
          <Card className="flex flex-col justify-between h-full bg-[#D85A30]/5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-coral mb-3">
              <span>🔥</span>
              <span>Streak Level</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-4xl font-extrabold text-coral">
                {streakCount} {streakCount === 1 ? 'Day' : 'Days'}
              </span>
              <span className="text-xs font-bold text-ink/75 mt-2 bg-[#D85A30]/10 border border-[#D85A30]/20 rounded px-2.5 py-1 w-fit">
                {badgeText}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Total Workouts card - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="col-span-1"
        >
          <Card className="h-full flex flex-col justify-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">Total Workouts</p>
            <p className="font-display text-4xl font-extrabold">{totalWorkouts}</p>
          </Card>
        </motion.div>

        {/* Current Weight card - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="col-span-1"
        >
          <Card className="h-full flex flex-col justify-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">Current Weight</p>
            <p className="font-display text-4xl font-extrabold">
              {currentWeight ?? '—'}
              <span className="ml-1 text-lg font-semibold text-ink/50">kg</span>
            </p>
          </Card>
        </motion.div>

        {/* Heatmap Tile: 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-1"
        >
          <Card className="h-full flex flex-col justify-between">
            <h3 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold">
              📅 Heatmap History
            </h3>
            <Heatmap logs={rawLogs} />
          </Card>
        </motion.div>

        {/* Weight Trend (Line Chart) - 2 cols on md */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
          className="md:col-span-2"
        >
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold">
              ⚖️ Weight Trend
            </h3>
            {weightHistory.length === 0 ? (
              <p className="text-sm text-ink/60">Log your weight to see trends.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#378ADD"
                    strokeWidth={3}
                    dot={{ r: 5, stroke: '#14121A', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>
        </motion.div>

        {/* Weekly Calories Burned (Bar Chart) - 2 cols on md */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
          className="md:col-span-2"
        >
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold">
              🔥 Weekly Calorie Burn
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={calorieHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="calories" fill="#378ADD" stroke="#14121A" strokeWidth={2} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Log weight card - 1 col */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="col-span-1"
        >
          <Card className="bg-[#D85A30]/5 h-full flex flex-col justify-between">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-coral">Log New Weight</p>
            <div className="flex gap-2 items-center mt-4">
              <Input
                type="number"
                placeholder="kg"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
              />
              <Button variant="dark" onClick={logWeight} disabled={saving}>
                Add
              </Button>
            </div>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}