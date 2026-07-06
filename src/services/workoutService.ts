import { supabase } from '@/lib/supabaseClient';
import { WorkoutPlan } from '@/types/workout';
import type { PlanCustomization } from '@/lib/openai';

export async function fetchCurrentPlan(userId: string): Promise<WorkoutPlan | null> {
  const { data, error } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as WorkoutPlan | null;
}

export async function generatePlan(customization?: PlanCustomization): Promise<WorkoutPlan> {
  const res = await fetch('/api/workout/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customization }),
  });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.error ?? `Failed to generate plan (HTTP ${res.status})`);
  }

  return body.plan;
}

export async function markDayComplete(planId: string, day: string) {
  const res = await fetch('/api/progress/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_id: planId, day }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Failed to save workout progress');
  }
  return res.json();
}