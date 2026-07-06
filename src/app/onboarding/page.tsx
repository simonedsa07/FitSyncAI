'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, calcBmi } from '@/lib/utils';
import { GOAL_OPTIONS as GOALS, ACTIVITY_OPTIONS as ACTIVITY } from '@/lib/options';
import type { ActivityLevel, Gender, Goal } from '@/types/user';
import { GeneratingOverlay } from '@/components/workout/GeneratingOverlay';

interface FormState {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: Gender;
  goal: Goal | null;
  activity: ActivityLevel | null;
  days: number | null;
}

const TOTAL_STEPS = 7;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    age: '',
    height: '',
    weight: '',
    gender: null,
    goal: null,
    activity: null,
    days: null,
  });

  const canNext =
    (step === 1 && form.name.trim().length > 0) ||
    (step === 2 && form.age) ||
    (step === 3 && form.height && form.weight) ||
    (step === 4 && form.goal) ||
    (step === 5 && form.activity) ||
    (step === 6 && form.days) ||
    step === 7;

 async function finish() {
  setSaving(true);
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You need to be signed in to finish onboarding. Please log in again.');
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      name: form.name.trim(),
      age: Number(form.age),
      height_cm: Number(form.height),
      weight_kg: Number(form.weight),
      gender: form.gender,
      goal: form.goal,
      activity_level: form.activity,
      days_per_week: form.days,
      onboarding_complete: true,
    });

    if (error) {
      console.error('Failed to save onboarding data:', error.message);
      alert('Could not save your profile: ' + error.message);
      setSaving(false);
      return;
    }

    const genRes = await fetch('/api/workout/generate', { method: 'POST' });
    if (!genRes.ok) {
      const body = await genRes.json().catch(() => ({}));
      alert('Profile saved, but plan generation failed: ' + (body.error ?? 'Unknown error'));
    }

    router.push('/dashboard');
  } finally {
    setSaving(false);
  }
}

  const bmi = calcBmi(Number(form.height) || null, Number(form.weight) || null);

  return (
<div data-force-light className="flex min-h-screen items-center justify-center px-4 py-10">      <div className="w-full max-w-md brutal-card p-8">
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ink/50">
          Step {step} of {TOTAL_STEPS}
        </p>

        {step === 1 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">What&apos;s your name?</h1>
            <Input
              placeholder="e.g. Alex"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              maxLength={80}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">How old are you?</h1>
            <Input
              type="number"
              placeholder="e.g. 25"
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">Your body metrics</h1>
            <div className="space-y-5">
              <Input
                label="Height (cm)"
                type="number"
                placeholder="e.g. 175"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
              />
              <Input
                label="Weight (kg)"
                type="number"
                placeholder="e.g. 70"
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/60">
                  Gender (optional)
                </p>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, gender: g }))}
                      className={cn('chip capitalize', form.gender === g && 'chip-active')}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">What&apos;s your goal?</h1>
            <div className="grid grid-cols-2 gap-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, goal: g.id }))}
                  className={cn(
                    'rounded-xl2 border-2 border-ink px-4 py-4 text-left transition-colors',
                    form.goal === g.id ? 'brutal-card-accent' : 'bg-white'
                  )}
                >
                  <p className="font-bold">{g.icon} {g.label}</p>
                  <p className="text-xs text-ink/60">{g.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">How active are you?</h1>
            <div className="grid grid-cols-2 gap-3">
              {ACTIVITY.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, activity: a.id }))}
                  className={cn(
                    'rounded-xl2 border-2 border-ink px-4 py-4 text-left transition-colors',
                    form.activity === a.id ? 'brutal-card-accent' : 'bg-white'
                  )}
                >
                  <p className="font-bold">{a.label}</p>
                  <p className="text-xs text-ink/60">{a.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">
              Training days per week?
            </h1>
            <div className="flex flex-wrap gap-2">
              {[2, 3, 4, 5, 6].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, days: d }))}
                  className={cn(
                    'chip h-14 w-14 !p-0 text-lg',
                    form.days === d && 'chip-active'
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h1 className="mb-6 font-display text-3xl font-extrabold">All set!</h1>
            <ul className="space-y-3 text-sm">
              <li>
                👋 {form.name}
              </li>
              <li>
                📊 {form.age} y/o · {form.height}cm · {form.weight}kg
                {bmi ? ` · BMI ${bmi}` : ''}
              </li>
              <li>
                🎯 Goal: <span className="font-bold">{GOALS.find((g) => g.id === form.goal)?.label}</span>
              </li>
              <li>
                ⚡ Activity:{' '}
                <span className="font-bold">{ACTIVITY.find((a) => a.id === form.activity)?.label}</span>
              </li>
              <li>
                📅 Training <span className="font-bold">{form.days}</span> days/week
              </li>
            </ul>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            ‹ Back
          </Button>
          {step < TOTAL_STEPS ? (
            <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
              Next ›
            </Button>
          ) : (
            <Button type="button" variant="dark" onClick={finish} disabled={saving}>
              {saving ? 'Generating…' : 'Generate my plan'}
            </Button>
          )}
        </div>
      </div>
      {saving && <GeneratingOverlay />}
    </div>
  );
}