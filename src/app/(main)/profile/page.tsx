'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/store/useUserStore';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GOAL_OPTIONS, ACTIVITY_OPTIONS, goalLabel, goalIcon, activityLabel } from '@/lib/options';
import { calcBmi, calculateDailyCalorieTarget } from '@/lib/utils';
import type { ActivityLevel, Gender, Goal } from '@/types/user';

function bmiCategory(bmi: number | null) {
  if (!bmi) return null;
  if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
  if (bmi < 25)   return { label: 'Healthy',     color: '#22c55e' };
  if (bmi < 30)   return { label: 'Overweight',  color: '#f59e0b' };
  return            { label: 'Obese',            color: '#ef4444' };
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/10 py-2.5 last:border-0">
      <span className="text-xs font-bold uppercase tracking-wide text-ink/50">{label}</span>
      <span className="text-sm font-extrabold text-ink">{value}</span>
    </div>
  );
}

export default function ProfilePage() {
  const { profile } = useAuth();
  const { updateProfile } = useUserStore();

  const [form, setForm] = useState({
    age: '',
    gender: 'female' as NonNullable<Gender>,
    height: '',
    weight: '',
    goal: 'fat_loss' as Goal,
    activity: 'moderate' as ActivityLevel,
    days: '4',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setForm({
      age: String(profile.age ?? ''),
      gender: (profile.gender as NonNullable<Gender>) ?? 'female',
      height: String(profile.height_cm ?? ''),
      weight: String(profile.weight_kg ?? ''),
      goal: (profile.goal as Goal) ?? 'fat_loss',
      activity: (profile.activity_level as ActivityLevel) ?? 'moderate',
      days: String(profile.days_per_week ?? 4),
    });
  }, [profile]);

  async function handleSave() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You are not logged in. Please log in again.');
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        name: profile?.name ?? 'User',
        email: user.email,
        age: Number(form.age),
        gender: form.gender,
        height_cm: Number(form.height),
        weight_kg: Number(form.weight),
        goal: form.goal,
        activity_level: form.activity,
        days_per_week: Number(form.days),
      });

      if (error) {
        console.error('Profile save failed:', error.message);
        alert('Could not save profile: ' + error.message);
        return;
      }

      // Sync the global store so every page reflects the new values immediately
      updateProfile({
        age: Number(form.age),
        gender: form.gender,
        height_cm: Number(form.height),
        weight_kg: Number(form.weight),
        goal: form.goal,
        activity_level: form.activity,
        days_per_week: Number(form.days),
      });

      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  // Live-computed stats from the form (update as user types)
  const liveProfile = {
    age: Number(form.age) || undefined,
    height_cm: Number(form.height) || undefined,
    weight_kg: Number(form.weight) || undefined,
    gender: form.gender,
    activity_level: form.activity,
    goal: form.goal,
  };
  const bmi = calcBmi(liveProfile.height_cm ?? null, liveProfile.weight_kg ?? null);
  const bmiCat = bmiCategory(bmi);
  const dailyKcal = calculateDailyCalorieTarget(liveProfile);

  // Initials avatar
  const initials = (profile?.name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Account</p>
        <h1 className="font-display text-4xl font-extrabold">Profile Settings</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* ── Left: Settings form ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Age"
                type="number"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
              />
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/70">
                  Gender
                </label>
                <select
                  className="brutal-input"
                  value={form.gender}
                  onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value as NonNullable<Gender> }))}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <Input
                label="Height (cm)"
                type="number"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              />

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/70">
                  Goal
                </label>
                <select
                  className="brutal-input"
                  value={form.goal}
                  onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value as Goal }))}
                >
                  {GOAL_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink/70">
                  Activity Level
                </label>
                <select
                  className="brutal-input"
                  value={form.activity}
                  onChange={(e) => setForm((f) => ({ ...f, activity: e.target.value as ActivityLevel }))}
                >
                  {ACTIVITY_OPTIONS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Days / Week"
                type="number"
                min={1}
                max={7}
                value={form.days}
                onChange={(e) => setForm((f) => ({ ...f, days: e.target.value }))}
              />
            </div>

            <Button className="mt-6" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save changes'}
            </Button>
          </Card>
        </motion.div>

        {/* ── Right: Stats at a glance ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="space-y-4"
        >
          {/* Avatar + name */}
          <Card>
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-ink text-white text-2xl font-extrabold shadow-brutal-sm"
              >
                {initials}
              </div>
              <div>
                <p className="font-display text-xl font-extrabold">{profile?.name ?? 'Your Name'}</p>
                <p className="text-xs text-ink/50">{profile?.email ?? ''}</p>
              </div>
            </div>
          </Card>

          {/* Stats panel */}
          <Card>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink/50">
              Stats at a glance
            </p>

            {/* BMI ring */}
            {bmi ? (
              <div className="mb-4 flex items-center gap-4 rounded-xl2 border-2 border-ink/10 bg-ink/[0.03] px-4 py-3">
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-ink text-lg font-extrabold"
                  style={{ backgroundColor: bmiCat?.color + '22', borderColor: bmiCat?.color }}
                >
                  <span style={{ color: bmiCat?.color }}>{bmi}</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink/50">BMI</p>
                  <p className="font-display text-base font-extrabold" style={{ color: bmiCat?.color }}>
                    {bmiCat?.label}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mb-4 rounded-xl2 border-2 border-dashed border-ink/20 px-4 py-3 text-xs text-ink/40">
                Add height & weight to see BMI
              </p>
            )}

            <StatRow label="Goal" value={`${goalIcon(form.goal)} ${goalLabel(form.goal)}`} />
            <StatRow label="Activity" value={activityLabel(form.activity)} />
            <StatRow label="Days / week" value={form.days || '—'} />
            {liveProfile.weight_kg && <StatRow label="Weight" value={`${liveProfile.weight_kg} kg`} />}
            {liveProfile.height_cm && <StatRow label="Height" value={`${liveProfile.height_cm} cm`} />}
            {dailyKcal && (
              <StatRow label="Daily target" value={`${dailyKcal.toLocaleString()} kcal`} />
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}