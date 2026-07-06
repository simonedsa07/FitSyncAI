import { createSupabaseAdminClient } from '@/lib/supabaseServer';

/**
 * Sliding-window-ish rate limiter backed by Postgres, safe across serverless instances.
 * Returns true if the request is allowed, false if the limit was exceeded.
 */
export async function checkRateLimit(
  userId: string,
  route: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc('check_rate_limit', {
    p_user_id: userId,
    p_route: route,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error('Rate limit check failed:', error.message);
    return true; // fail open — don't block real users if the limiter itself breaks
  }

  return data === true;
}