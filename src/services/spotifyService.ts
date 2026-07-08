export interface PhiniteResult {
  spotify_playlist_link: string | null;
  playlist_name: string | null;
  track_count: number | null;
  playlist_duration: number | null;
  music_plan: Record<string, unknown> | null;
  raw: string;
}

export async function askMusicAgent(message: string): Promise<PhiniteResult> {
  const res = await fetch('/api/phinite/generate-playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: message }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body?.error ?? `Failed to reach music agent (HTTP ${res.status})`);
  }
  return body;
}
