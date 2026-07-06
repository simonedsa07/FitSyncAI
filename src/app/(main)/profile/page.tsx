'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { connectSpotify } from '@/services/spotifyService';
import { GOAL_OPTIONS, ACTIVITY_OPTIONS } from '@/lib/options';
import type { ActivityLevel, Gender, Goal } from '@/types/user';

function SpotifyStatusBanner() {
  const searchParams = useSearchParams();
  const spotifyStatus = searchParams.get('spotify');

  if (!spotifyStatus) return null;

  return (
    <>
      {spotifyStatus === 'not_configured' && (
        <p className="text-xs font-semibold text-red-600">
          Spotify isn&apos;t configured yet — add SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, and
          SPOTIFY_REDIRECT_URI to .env.local (see the setup guide) and restart the server.
        </p>
      )}
      {spotifyStatus === 'error' && (
        <p className="text-xs font-semibold text-red-600">
          Spotify connection failed. Check your Client ID/Secret and redirect URI match exactly.
        </p>
      )}
      {spotifyStatus === 'connected' && (
        <p className="text-xs font-semibold text-emerald-600">Spotify connected successfully!</p>
      )}
    </>
  );
}

export default function ProfilePage() {
  const { profile } = useAuth();

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

      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-4xl font-extrabold">Profile Settings</h1>

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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl2 border-2 border-ink brutal-card-accent">
              🎵
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Spotify</p>
              <p className="font-bold">Not connected</p>
            </div>
          </div>
          <Button variant="accent" onClick={connectSpotify}>
            Connect
          </Button>
        </Card>
      </motion.div>

      <Suspense fallback={null}>
        <SpotifyStatusBanner />
      </Suspense>
    </div>
  );
}