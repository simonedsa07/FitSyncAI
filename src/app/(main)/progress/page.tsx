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
import { formatDate } from '@/lib/utils';

interface WeightPoint {
  date: string;
  weight: number;
}

interface WorkoutCountPoint {
  day: string;
  count: number;
}

export default function ProgressPage() {
  const { profile } = useAuth();
  const [weightInput, setWeightInput] = useState('');
  const [weightHistory, setWeightHistory] = useState<WeightPoint[]>([]);
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutCountPoint[]>([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile?.id) return;
    loadProgress();
  }, [profile?.id]);

  async function loadProgress() {
    if (!profile) return;

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

    const { data: logs, count, error: logsError } = await supabase
      .from('workout_logs')
      .select('completed_at', { count: 'exact' })
      .eq('user_id', profile.id);

    if (logsError) {
      console.error('Failed to load workout logs:', logsError.message);
    }

    setTotalWorkouts(count ?? 0);

    const last7 = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayCount = (logs ?? []).filter(
        (l) => new Date(l.completed_at).toDateString() === d.toDateString()
      ).length;
      return { day: label, count: dayCount };
    });
    setWorkoutHistory(last7);
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0 }}
          whileHover={{ y: -3 }}
        >
          <Card>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
              Total Workouts
            </p>
            <p className="font-display text-4xl font-extrabold">{totalWorkouts}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          whileHover={{ y: -3 }}
        >
          <Card>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
              Current Weight
            </p>
            <p className="font-display text-4xl font-extrabold">
              {currentWeight ?? '—'}
              <span className="ml-1 text-lg font-semibold text-ink/50">kg</span>
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          whileHover={{ y: -3 }}
        >
          <Card accent className="flex flex-col justify-between">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide" style={{ color: 'rgba(20,18,26,0.6)' }}>
              Log Weight
            </p>
            <div className="flex gap-2">
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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.24 }}
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
 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.32 }}
        >
          <Card>
            <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold">
              📈 Last 7 Days
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={workoutHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00000015" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#378ADD" stroke="#14121A" strokeWidth={2} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}