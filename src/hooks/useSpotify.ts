'use client';

import { useState, useCallback } from 'react';
import { connectSpotify, createPlaylist } from '@/services/spotifyService';

export function useSpotify(connected: boolean) {
  const [creating, setCreating] = useState(false);

  const connect = useCallback(() => connectSpotify(), []);

  const generatePlaylist = useCallback(async (intensity: 'low' | 'medium' | 'high') => {
    setCreating(true);
    try {
      return await createPlaylist(intensity);
    } finally {
      setCreating(false);
    }
  }, []);

  return { connected, connect, generatePlaylist, creating };
}
