import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, createSupabaseAdminClient } from '@/lib/supabaseServer';
import { createWorkoutPlaylist, refreshSpotifyToken } from '@/lib/spotify';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const allowed = await checkRateLimit(user.id, 'spotify-playlist', 5, 60);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests — please wait a moment.' }, { status: 429 });
  }
  const { intensity = 'medium', spotify_uris = [], name, description } = await request.json();
  const admin = createSupabaseAdminClient();

  const { data: tokenRow } = await admin
    .from('spotify_tokens')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!tokenRow) {
    return NextResponse.json({ error: 'Spotify not connected' }, { status: 400 });
  }

  let accessToken = tokenRow.access_token;
  if (Date.now() > tokenRow.expires_at) {
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

  const playlist = await createWorkoutPlaylist(accessToken, user.id, intensity, {
    spotifyUris: Array.isArray(spotify_uris) ? spotify_uris : [],
    name,
    description,
  });
  return NextResponse.json({ playlist });
}
