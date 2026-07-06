import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken } from '@/lib/spotify';
import { createSupabaseAdminClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state'); // this is the user id we passed in

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;

  if (!code || !state) {
    return NextResponse.redirect(new URL('/profile?spotify=error', siteUrl));
  }

  try {
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI ?? `${request.nextUrl.origin}/api/spotify/callback`;
    const tokens = await exchangeCodeForToken(code, redirectUri);
    const admin = createSupabaseAdminClient();

    await admin.from('spotify_tokens').upsert({
      user_id: state,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
    });

    return NextResponse.redirect(new URL('/profile?spotify=connected', siteUrl));
  } catch {
    return NextResponse.redirect(new URL('/profile?spotify=error', siteUrl));
  }
}
