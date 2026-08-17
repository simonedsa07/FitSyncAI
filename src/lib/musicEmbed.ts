export type MusicPlatform = 'spotify' | 'apple_music' | 'youtube_music' | 'soundcloud';

export const PLATFORMS: { id: MusicPlatform; label: string; imgSrc: string; brandBg: string; placeholder: string }[] = [
  { id: 'spotify',       label: 'Spotify',       imgSrc: '/music-logos/spotify.jpg',       brandBg: '#1DB954', placeholder: 'https://open.spotify.com/playlist/...' },
  { id: 'apple_music',   label: 'Apple Music',   imgSrc: '/music-logos/apple-music.png',   brandBg: '#fc3c44', placeholder: 'https://music.apple.com/playlist/...' },
  { id: 'youtube_music', label: 'YouTube Music', imgSrc: '/music-logos/youtube-music.png', brandBg: '#FF0000', placeholder: 'https://music.youtube.com/playlist?list=...' },
  { id: 'soundcloud',    label: 'SoundCloud',    imgSrc: '/music-logos/soundcloud.png',    brandBg: '#ff5500', placeholder: 'https://soundcloud.com/you/sets/...' },
];

interface ParsedEmbed {
  embedUrl: string | null;
  height: number;
}

export function buildEmbedUrl(platform: MusicPlatform, url: string): ParsedEmbed {
  try {
    const u = new URL(url.trim());

    switch (platform) {
      case 'spotify': {
        // e.g. https://open.spotify.com/playlist/37i9dQZF1... -> /embed/playlist/...
        const match = u.pathname.match(/\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
        if (!match) return { embedUrl: null, height: 152 };
        return {
          embedUrl: `https://open.spotify.com/embed/${match[1]}/${match[2]}`,
          height: match[1] === 'track' ? 152 : 352,
        };
      }
      case 'youtube_music': {
        // music.youtube.com/playlist?list=XXXX -> youtube.com/embed/videoseries?list=XXXX
        const listId = u.searchParams.get('list');
        if (!listId) return { embedUrl: null, height: 315 };
        return { embedUrl: `https://www.youtube.com/embed/videoseries?list=${listId}`, height: 315 };
      }
      case 'soundcloud': {
        return {
          embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.toString())}&color=%23f6a8c8&auto_play=false&show_comments=false`,
          height: 300,
        };
      }
      case 'apple_music': {
        // music.apple.com/us/playlist/name/pl.xxxx -> embed.music.apple.com/us/playlist/name/pl.xxxx
        const embedUrl = u.toString().replace('music.apple.com', 'embed.music.apple.com');
        return { embedUrl, height: 300 };
      }
      default:
        return { embedUrl: null, height: 152 };
    }
  } catch {
    return { embedUrl: null, height: 152 };
  }
}