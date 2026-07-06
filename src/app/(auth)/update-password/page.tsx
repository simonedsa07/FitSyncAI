'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      // Password updated successfully! Send them back to the app/login
      router.push('/login');
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pt-20">
      <h1 className="font-display text-3xl font-extrabold text-center">New Password</h1>
      <Card>
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input 
            label="New Password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          {errorMsg && (
            <p className="text-red-600 text-sm font-semibold">{errorMsg}</p>
          )}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
}