import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import type { WorkoutDay } from '@/types/workout';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { plan_id, day } = await request.json();
  if (!plan_id || !day) {
    return NextResponse.json({ error: 'plan_id and day are required' }, { status: 400 });
  }

  const { data: plan, error: fetchError } = await supabase
    .from('workout_plans')
    .select('*')
    .eq('id', plan_id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: `Fetch failed: ${fetchError.message}` }, { status: 500 });
  }
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found (or not visible to this user)' }, { status: 404 });
  }

  const updatedDays: WorkoutDay[] = plan.days.map((d: WorkoutDay) =>
    d.day === day ? { ...d, completed: true } : d
  );

  const { data: updated, error: updateError } = await supabase
    .from('workout_plans')
    .update({ days: updatedDays })
    .eq('id', plan_id)
    .select()
    .maybeSingle();

  if (updateError) {
    return NextResponse.json({ error: `Update failed: ${updateError.message}` }, { status: 500 });
  }
  if (!updated) {
    return NextResponse.json(
      { error: 'Update matched 0 rows — check RLS policy on workout_plans for this user.' },
      { status: 500 }
    );
  }

  const { error: logError } = await supabase.from('workout_logs').insert({
    user_id: user.id,
    plan_id,
    day,
    completed_at: new Date().toISOString(),
  });

  if (logError) {
    console.error('workout_logs insert failed:', logError.message);
  }

  return NextResponse.json({ success: true });
}