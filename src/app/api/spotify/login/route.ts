import { NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (!user) {
    return NextResponse.redirect(new URL('/login', siteUrl));
  }

  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET || !process.env.SPOTIFY_REDIRECT_URI) {
    return NextResponse.redirect(new URL('/profile?spotify=not_configured', siteUrl));
  }

  const url = getSpotifyAuthUrl(user.id);
  return NextResponse.redirect(url);
}