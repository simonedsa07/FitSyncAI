import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabaseServer';
import { refreshSpotifyToken } from '@/lib/spotify';

const PHINITE_AGENT_URL = process.env.PHINITE_AGENT_URL ?? 'https://app.phinite.ai/api/v1/ai/a2a/zwi3lh_mv';

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let body: { prompt?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const { data: tokenRow, error: tokenError } = await admin
      .from('spotify_tokens')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (tokenError) {
      console.error('Failed to load Spotify token row:', tokenError);
      return NextResponse.json({ error: 'Unable to read Spotify connection' }, { status: 500 });
    }

    if (!tokenRow?.access_token) {
      return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
    }

    let accessToken = tokenRow.access_token;
    if (tokenRow.expires_at && Date.now() >= tokenRow.expires_at) {
      if (!tokenRow.refresh_token) {
        return NextResponse.json({ error: 'Spotify session expired. Please reconnect Spotify.' }, { status: 400 });
      }

      const refreshed = await refreshSpotifyToken(tokenRow.refresh_token);
      accessToken = refreshed.access_token;

      await admin
        .from('spotify_tokens')
        .update({
          access_token: refreshed.access_token,
          expires_at: Date.now() + refreshed.expires_in * 1000,
        })
        .eq('user_id', user.id);
    }

    const enhancedPrompt = `${prompt}\n\nIf the user asks for music or a playlist, you MUST return a strict JSON object with this exact structure: { "message": "your conversational reply", "spotify_uris": ["spotify:track:123", "spotify:track:456"] }. Do not include markdown formatting.`;

    const phiniteResponse = await fetch(PHINITE_AGENT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Spotify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        spotify_access_token: accessToken,
        user_id: user.id,
      }),
    });

    const responseText = await phiniteResponse.text();
    let data: unknown;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    if (!phiniteResponse.ok) {
      return NextResponse.json(
        {
          error: (data as { error?: string; detail?: string })?.error ?? (data as { error?: string; detail?: string })?.detail ?? 'Phinite agent request failed',
          details: data,
        },
        { status: phiniteResponse.status >= 500 ? 502 : 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Agent route error:', error);
    return NextResponse.json({ error: 'Unexpected error while contacting the agent' }, { status: 500 });
  }
}
