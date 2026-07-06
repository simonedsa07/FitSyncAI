const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const SCOPES = ['playlist-modify-public', 'playlist-modify-private', 'user-read-email'].join(' ');

export function getSpotifyAuthUrl(state: string, redirectUri?: string) {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    scope: SCOPES,
    redirect_uri: redirectUri ?? process.env.SPOTIFY_REDIRECT_URI!,
    state,
  });
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri?: string) {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri ?? process.env.SPOTIFY_REDIRECT_URI!,
    }),
  });

  if (!res.ok) throw new Error(`Spotify token exchange failed: ${await res.text()}`);
  return res.json() as Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }>;
}

export async function refreshSpotifyToken(refreshToken: string) {
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basic}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) throw new Error(`Spotify token refresh failed: ${await res.text()}`);
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function createWorkoutPlaylist(
  accessToken: string,
  userId: string,
  intensity: 'low' | 'medium' | 'high',
  options: { spotifyUris?: string[]; name?: string; description?: string } = {}
) {
  const meRes = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const me = await meRes.json();

  let uris = (options.spotifyUris ?? []).filter((uri): uri is string => typeof uri === 'string' && uri.trim().length > 0);

  if (!uris.length) {
    const seedGenreByIntensity = {
      low: 'chill',
      medium: 'pop-workout',
      high: 'edm',
    }[intensity];

    const searchRes = await fetch(
      `${SPOTIFY_API_BASE}/search?q=genre:${seedGenreByIntensity}&type=track&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const searchData = await searchRes.json();
    uris = (searchData.tracks?.items ?? []).map((t: { uri: string }) => t.uri);
  }

  const playlistRes = await fetch(`${SPOTIFY_API_BASE}/users/${me.id}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: options.name ?? 'FitSync AI Workout Mix',
      description: options.description ?? 'AI-generated playlist matched to your workout intensity.',
      public: false,
    }),
  });
  const playlist = await playlistRes.json();

  if (uris.length) {
    await fetch(`${SPOTIFY_API_BASE}/playlists/${playlist.id}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris }),
    });
  }

  return {
    id: playlist.id,
    name: playlist.name,
    url: playlist.external_urls?.spotify,
    image: playlist.images?.[0]?.url ?? null,
    track_count: uris.length,
  };
}
