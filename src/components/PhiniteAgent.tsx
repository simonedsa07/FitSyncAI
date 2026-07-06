'use client';

import { FormEvent, useState } from 'react';

export function PhiniteAgent() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error ?? 'Unable to contact the Phinite agent.';
        if (res.status === 400 || res.status === 401) {
          setError(message.includes('Spotify not connected') ? 'Please connect Spotify first.' : message);
        } else {
          setError(message);
        }
        return;
      }

      setResponse(data?.reply ?? data?.message ?? data?.result ?? 'Done');
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
      {response ? <pre className="whitespace-pre-wrap rounded-lg bg-slate-100 p-3 text-sm">{response}</pre> : null}
    </form>
  );
}
