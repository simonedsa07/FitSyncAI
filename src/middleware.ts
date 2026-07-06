import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

const PROTECTED_PREFIXES = ['/dashboard', '/workout', '/chat', '/progress', '/profile'];
const ONBOARDING_PATH = '/onboarding';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  const isOnboarding = path.startsWith(ONBOARDING_PATH);

  if ((isProtected || isOnboarding) && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Enforce onboarding completion for the main app — this is what was missing:
  // a valid session alone isn't enough, the profile must exist AND be marked complete.
  if (isProtected && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_complete')
      .eq('id', user.id)
      .maybeSingle();

    if (!profile || !profile.onboarding_complete) {
      return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workout/:path*',
    '/chat/:path*',
    '/progress/:path*',
    '/profile/:path*',
    '/onboarding/:path*',
  ],
};