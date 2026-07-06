'use client';

import { SpotlightCard as Card } from '@/components/ui/SpotlightCard';
import { Button } from '@/components/ui/Button';

interface PlaylistCardProps {
  connected: boolean;
  onConnect: () => void;
}

export function PlaylistCard({ connected, onConnect }: PlaylistCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Music</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink brutal-card-accent">
          🎵
        </div>
      </div>
      <h3 className="font-display text-xl font-extrabold">
        {connected ? 'Spotify connected' : 'Connect Spotify'}
      </h3>
      <p className="mt-2 flex-1 text-sm text-ink/70">
        Get AI-generated workout playlists matched to your intensity.
      </p>
      {!connected && (
        <Button variant="accent" className="mt-4 w-full" onClick={onConnect}>
          🎵 Connect
        </Button>
      )}
    </Card>
  );
}
