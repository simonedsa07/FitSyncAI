export interface SpotifyTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  url: string;
  image: string | null;
  track_count: number;
}
