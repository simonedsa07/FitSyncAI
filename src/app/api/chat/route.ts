import { NextRequest, NextResponse } from 'next/server';
import { askFitSyncAI } from '@/lib/openai';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const allowed = await checkRateLimit(user.id, 'chat', 15, 60);
    if (!allowed) {
      return NextResponse.json(
        { reply: "You're sending messages too fast — wait a moment and try again." },
        { status: 429 }
      );
    }

    const { history = [], message } = await request.json();

    if (!message || typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Message is required and must be under 2000 characters' }, { status: 400 });
    }

    if (!process.env.NVIDIA_API_KEY) {
      return NextResponse.json(
        { reply: 'FitSync AI is not configured yet — add NVIDIA_API_KEY to .env.local and restart the server.' },
        { status: 200 }
      );
    }

    const reply = await askFitSyncAI([...history, { role: 'user', content: message }]);

    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: message },
      { user_id: user.id, role: 'assistant', content: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat route error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ reply: `Sorry, something went wrong: ${message}` }, { status: 200 });
  }
}