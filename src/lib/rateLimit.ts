import { createSupabaseAdminClient } from '@/lib/supabaseServer';

const fallbackRateLimitStore = new Map<string, number[]>();

function fallbackRateLimit(userId: string, route: string, limit: number, windowSeconds: number): boolean {
  const key = `${userId}:${route}`;
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const history = fallbackRateLimitStore.get(key) ?? [];
  const recent = history.filter((timestamp) => now - timestamp <= windowMs);

  if (recent.length >= limit) {
    fallbackRateLimitStore.set(key, recent);
    return false;
  }

  recent.push(now);
  fallbackRateLimitStore.set(key, recent);
  return true;
}

/**
 * Sliding-window-ish rate limiter backed by Postgres, safe across serverless instances.
 * Falls back to a local in-memory limiter if the service role key is missing or invalid.
 */
export async function checkRateLimit(
  userId: string,
  route: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is missing; falling back to in-memory rate limiting.');
    return fallbackRateLimit(userId, route, limit, windowSeconds);
  }

  if (anonKey && serviceRoleKey === anonKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY matches NEXT_PUBLIC_SUPABASE_ANON_KEY; falling back to in-memory rate limiting.');
    return fallbackRateLimit(userId, route, limit, windowSeconds);
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.rpc('check_rate_limit', {
    p_user_id: userId,
    p_route: route,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.warn('Rate limit RPC failed; falling back to local rate limiter:', error.message);
    return fallbackRateLimit(userId, route, limit, windowSeconds);
  }

  return data === true;
}