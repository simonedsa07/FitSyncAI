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

  const { message } = await request.json().catch(() => ({}));

  if (!message || typeof message !== 'string' || message.length > 500) {
    return NextResponse.json({ error: 'A message is required (under 500 characters)' }, { status: 400 });
  }

  try {
    const result = await callPhiniteAgent(message);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Phinite playlist generation failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to reach music agent' },
      { status: 500 }
    );
  }
}