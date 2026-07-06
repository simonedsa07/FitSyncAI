'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthInput } from '@/components/auth/AuthInput';
import { Button } from '@/components/ui/Button';
import { signIn, signInWithGoogle } from '@/services/authService';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setGoogleLoading(false);
    }
  }

  return (
    <AuthCard eyebrow="Welcome back">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <AuthInput
          id="email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {/* --- PASSWORD INPUT & FORGOT LINK --- */}
        <div className="space-y-2">
          <AuthInput
            id="password"
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold uppercase tracking-wide text-ink/70 hover:text-ink hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink/15" />
        <span className="text-xs font-bold uppercase tracking-wide text-ink/40">or</span>
        <div className="h-px flex-1 bg-ink/15" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="btn-pill-ghost w-full"
      >
        {googleLoading ? 'Redirecting…' : 'Continue with Google'}
      </button>

      <p className="mt-6 text-center text-sm text-ink/70">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-bold underline">
          Sign up
        </Link>
      </p>
    </AuthCard>
  );
}