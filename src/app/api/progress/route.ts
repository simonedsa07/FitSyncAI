import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const [{ data: weights }, { count }] = await Promise.all([
    supabase
      .from('weight_logs')
      .select('logged_at, weight_kg')
      .eq('user_id', user.id)
      .order('logged_at', { ascending: true }),
    supabase
      .from('workout_logs')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  return NextResponse.json({ weights: weights ?? [], total_workouts: count ?? 0 });
}

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const allowed = await checkRateLimit(user.id, 'progress-log', 20, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests — please wait a moment.' }, { status: 429 });
  }

  const { weight_kg } = await request.json();
  if (typeof weight_kg !== 'number' || !Number.isFinite(weight_kg) || weight_kg < 20 || weight_kg > 400) {
    return NextResponse.json({ error: 'weight_kg must be a realistic number between 20 and 400' }, { status: 400 });
  }

  const { error } = await supabase.from('weight_logs').insert({
    user_id: user.id,
    weight_kg,
    logged_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.from('profiles').update({ weight_kg }).eq('id', user.id);

  return NextResponse.json({ success: true });
}
