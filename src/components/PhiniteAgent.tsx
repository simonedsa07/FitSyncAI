'use client';

import { FormEvent, useState } from 'react';
import { useSpotifyPlayerStore } from '@/store/useSpotifyPlayerStore';

interface AgentResponse {
  reply?: string;
  message?: string;
  result?: string;
  spotify_uris?: unknown;
  error?: string;
}

export function PhiniteAgent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playlistStatus, setPlaylistStatus] = useState<'idle' | 'creating' | 'created' | 'error'>('idle');
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const setActivePlaylist = useSpotifyPlayerStore((state) => state.setActivePlaylist);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');
    setPlaylistStatus('idle');
    setPlaylistUrl(null);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data: AgentResponse = await res.json();

      if (!res.ok) {
        const message = data?.error ?? 'Unable to contact the Phinite agent.';
        if (res.status === 400 || res.status === 401) {
          setError(message.includes('Spotify not connected') ? 'Please connect Spotify first.' : message);
        } else {
          setError(message);
        }
        return;
      }

      const messageText = data?.message ?? data?.reply ?? data?.result ?? 'Done';
      setResponse(messageText);

      const spotifyUris = Array.isArray(data?.spotify_uris)
        ? data.spotify_uris.filter((uri): uri is string => typeof uri === 'string' && uri.trim().length > 0)
        : [];

      if (spotifyUris.length > 0) {
        setPlaylistStatus('creating');
        const playlistRes = await fetch('/api/spotify/create-playlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spotify_uris: spotifyUris }),
        });
        const playlistData = await playlistRes.json().catch(() => null);

        if (!playlistRes.ok) {
          const playlistMessage = playlistData?.error ?? 'Unable to create the playlist.';
          setError(playlistMessage);
          setPlaylistStatus('error');
          return;
        }

        const nextUrl = playlistData?.playlist?.url ?? null;
        setPlaylistUrl(nextUrl);
        setPlaylistStatus('created');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Ask your Phinite agent to help with your workout or playlist"
        className="w-full rounded-lg border border-slate-300 p-3"
        rows={4}
      />
      <button type="submit" disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
        {loading ? 'Sending…' : 'Send'}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {playlistStatus === 'creating' ? <p className="text-sm text-amber-700">Creating your playlist…</p> : null}
      {playlistStatus === 'created' ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Playlist Created!</p>
          <button
            type="button"
            onClick={() => playlistUrl && setActivePlaylist(playlistUrl)}
            className="mt-2 rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
          >
            Listen on Dashboard
          </button>
        </div>
      ) : null}
      {response ? <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{response}</pre> : null}
    </form>
  );
}
