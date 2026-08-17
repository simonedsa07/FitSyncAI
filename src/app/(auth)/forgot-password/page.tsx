'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // Supabase will redirect the user here after they click the email link
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus('error');
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-20">
      <h1 className="font-display text-3xl font-extrabold text-center">Reset Password</h1>
      <Card>
        {status === 'success' ? (
          <p className="text-teal font-semibold text-center">
            Check your email for the reset link!
          </p>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <Input 
              label="Email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {status === 'error' && (
              <p className="text-red-600 text-sm font-semibold">{errorMessage}</p>
            )}
            <Button className="w-full" type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}