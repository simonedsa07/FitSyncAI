interface SpotifyRefreshResponse {
  access_token: string;
  token_type: string;
  scope?: string;
  expires_in: number;
  refresh_token?: string;
}

interface SpotifyErrorResponse {
  error?: string;
  error_description?: string;
}

function getSpotifyCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET');
  }

  return { clientId, clientSecret };
}

export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyRefreshResponse> {
  const { clientId, clientSecret } = getSpotifyCredentials();
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<SpotifyRefreshResponse> & SpotifyErrorResponse;

  if (!response.ok) {
    const detail = data.error_description ?? data.error ?? `HTTP ${response.status}`;
    throw new Error(`Failed to refresh Spotify token: ${detail}`);
  }

  if (!data.access_token || typeof data.expires_in !== 'number') {
    throw new Error('Spotify token refresh response was missing required fields');
  }

  return data as SpotifyRefreshResponse;
}
