import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl));
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REDIRECT_URI) {
    return NextResponse.redirect(new URL('/profile?spotify=not_configured', siteUrl));
  }

  const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? `${request.nextUrl.origin}/api/spotify/callback`;
  const url = getSpotifyAuthUrl(user.id, redirectUri);
  return NextResponse.redirect(url);
}