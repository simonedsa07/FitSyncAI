'use client';

import { useState, FormEvent } from 'react';
import { SpotlightCard as Card } from '@/components/ui/SpotlightCard';
import { askMusicAgent, PhiniteResult } from '@/services/spotifyService';

export function PlaylistCard() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhiniteResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await askMusicAgent(message.trim());
      setResult(data);
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Music</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink brutal-card-accent">
          🎵
        </div>
      </div>
      <h3 className="font-display text-xl font-extrabold">Ask for a playlist</h3>
      <p className="mt-1 text-sm text-ink/70">
        e.g. &quot;45 min intense cardio playlist, kpop — mainly BTS and SEVENTEEN&quot;
      </p>

      {result?.spotifyPlaylistId && (
        <>
          <div className="mt-3 overflow-hidden rounded-xl2 border-2 border-ink">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${result.spotifyPlaylistId}?utm_source=generator`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Generated Spotify playlist"
            />
          </div>
          <a
            href={result.spotifyPlaylistUrl ?? `https://open.spotify.com/playlist/${result.spotifyPlaylistId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-accent mt-3 w-full justify-center text-sm"
          >
            🎧 Open in Spotify
          </a>
        </>
      )}

      {!result?.spotifyPlaylistId && result?.otherLink && (
        <a
          href={result.otherLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-xl2 border-2 border-ink bg-white px-3 py-2 text-xs font-semibold underline"
        >
          {result.raw}
        </a>
      )}

      {!result?.spotifyPlaylistId && !result?.otherLink && result?.raw && (
        <p className="mt-3 rounded-xl2 border-2 border-ink bg-white px-3 py-2 text-xs">{result.raw}</p>
      )}

      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the playlist you want…"
          disabled={loading}
          className="brutal-input flex-1 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-ink brutal-card-accent disabled:opacity-50"
          aria-label="Send"
        >
          {loading ? '…' : '🎵'}
        </button>
      </form>
    </Card>
  );
}