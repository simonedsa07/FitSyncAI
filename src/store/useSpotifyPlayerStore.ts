import { create } from 'zustand';

interface SpotifyPlayerState {
  activePlaylistUrl: string | null;
  setActivePlaylist: (url: string | null) => void;
  clearActivePlaylist: () => void;
}

export const useSpotifyPlayerStore = create<SpotifyPlayerState>((set) => ({
  activePlaylistUrl: null,
  setActivePlaylist: (url) => set({ activePlaylistUrl: url }),
  clearActivePlaylist: () => set({ activePlaylistUrl: null }),
}));
