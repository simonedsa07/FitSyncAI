import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (!code) {
    return NextResponse.redirect(new URL('/login', siteUrl));
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL('/login?error=oauth', siteUrl));
  }

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id, onboarding_complete')
    .eq('id', data.user.id)
    .maybeSingle();

  if (!existingProfile) {
    await supabase.from('profiles').upsert({
      id: data.user.id,
      name: data.user.user_metadata?.full_name ?? data.user.email?.split('@')[0] ?? 'User',
      email: data.user.email,
      onboarding_complete: false,
    });
    return NextResponse.redirect(new URL('/onboarding', siteUrl));
  }

  if (!existingProfile.onboarding_complete) {
    return NextResponse.redirect(new URL('/onboarding', siteUrl));
  }

  return NextResponse.redirect(new URL('/dashboard', siteUrl));
}