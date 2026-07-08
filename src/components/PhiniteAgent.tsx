'use client';

import { FormEvent, useState } from 'react';

interface AgentResponse {
  reply?: string;
  message?: string;
  result?: string;
  spotify_playlist_link?: string | null;
  playlist_name?: string | null;
  track_count?: number | null;
  playlist_duration?: number | null;
  raw?: string;
  error?: string;
}

export function PhiniteAgent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');
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
        setError(message.includes('Spotify not connected') ? 'Please connect Spotify first.' : message);
        return;
      }

      const details = [
        data?.playlist_name,
        data?.track_count ? `${data.track_count} tracks` : null,
        data?.playlist_duration ? `${data.playlist_duration} min` : null,
      ].filter(Boolean);

      setResponse(data?.message ?? data?.reply ?? data?.result ?? (details.length > 0 ? details.join(' · ') : data?.raw ?? 'Done'));
      setPlaylistUrl(data?.spotify_playlist_link ?? null);
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
        {loading ? 'Sending...' : 'Send'}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {playlistUrl ? (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-800">
          <p className="font-semibold">Playlist created</p>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white"
          >
            Open in Spotify
          </a>
        </div>
      ) : null}
      {response ? <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{response}</pre> : null}
    </form>
  );
}
