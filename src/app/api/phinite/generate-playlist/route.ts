import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { callPhiniteAgent } from '@/lib/phinite';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const allowed = await checkRateLimit(user.id, 'phinite-playlist', 8, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests — please wait a moment.' }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
  const legacyMessage = typeof body?.message === 'string' ? body.message.trim() : '';
  const musicPlan = body?.music_plan;
  const hasMusicPlan = typeof musicPlan === 'object' && musicPlan !== null && !Array.isArray(musicPlan);

  if (!hasMusicPlan && !prompt && !legacyMessage) {
    return NextResponse.json(
      { error: 'Send either music_plan or a natural-language prompt.' },
      { status: 400 }
    );
  }

  if ((prompt && prompt.length > 500) || (legacyMessage && legacyMessage.length > 500)) {
    return NextResponse.json({ error: 'Prompt must be under 500 characters.' }, { status: 400 });
  }

  try {
    const result = await callPhiniteAgent(
      hasMusicPlan ? { music_plan: musicPlan } : { prompt: prompt || legacyMessage }
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error('Phinite playlist generation failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to reach music agent' },
      { status: 500 }
    );
  }
}
