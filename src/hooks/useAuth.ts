'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useUserStore } from '@/store/useUserStore';

export function useAuth() {
  const router = useRouter();
  const { profile, loading, setProfile, setLoading } = useUserStore();

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        if (active) setProfile(null);
        return;
      }

      const { data: profileRow, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to load profile:', error.message);
      }

      if (active) {
        setProfile(profileRow ?? null);
      }
      // Theme is intentionally NOT auto-applied from the profile here.
      // It only changes when the user picks one from the palette icon.
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [setProfile, setLoading]);

  async function logout() {
  await supabase.auth.signOut();
  setProfile(null);
  router.push('/');
}

  return { profile, loading, logout };
}