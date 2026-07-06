export function connectSpotify() {
  window.location.href = '/api/spotify/login';
}

export async function createPlaylist(intensity: 'low' | 'medium' | 'high' = 'medium') {
  const res = await fetch('/api/spotify/create-playlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intensity }),
  });
  if (!res.ok) throw new Error('Failed to create playlist');
  return res.json();
}
