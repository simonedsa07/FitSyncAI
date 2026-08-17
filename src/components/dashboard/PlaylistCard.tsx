'use client';

import { useState, useEffect, FormEvent } from 'react';
import { SpotlightCard as Card } from '@/components/ui/SpotlightCard';
import { PLATFORMS, buildEmbedUrl, MusicPlatform } from '@/lib/musicEmbed';
import {
  fetchMusicEmbeds,
  saveMusicEmbed,
  deleteMusicEmbed,
  MusicEmbedRecord,
} from '@/services/musicService';
import { useUserStore } from '@/store/useUserStore';
import { cn } from '@/lib/utils';

export function PlaylistCard() {
  const profile = useUserStore((s) => s.profile);
  const [embeds, setEmbeds] = useState<MusicEmbedRecord[]>([]);
  const [adding, setAdding] = useState<MusicPlatform | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    fetchMusicEmbeds(profile.id).then(setEmbeds).catch(() => setEmbeds([]));
  }, [profile?.id]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!adding || !urlInput.trim()) return;
    setError(null);
    setSaving(true);
    try {
      const { embedUrl } = buildEmbedUrl(adding, urlInput.trim());
      if (!embedUrl) {
        setError("That link doesn't look right — paste the direct playlist/album URL.");
        return;
      }
      const saved = await saveMusicEmbed(adding, urlInput.trim());
      setEmbeds((prev) => [saved, ...prev]);
      setUrlInput('');
      setAdding(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that link');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove(id: string) {
    setEmbeds((prev) => prev.filter((e) => e.id !== id));
    try {
      await deleteMusicEmbed(id);
    } catch (err) {
      console.error('Failed to delete embed:', err);
    }
  }

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/60">Music</p>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink brutal-card-accent overflow-hidden">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l11-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="17" cy="16" r="3" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-xl font-extrabold">Your Playlists</h3>
      <p className="mt-1 text-sm text-ink/70">
        Connect a playlist from whatever you already use.
      </p>

      {embeds.length > 0 && (
        <div className="mt-4 space-y-4">
          {embeds.map((embed) => {
            const { embedUrl, height } = buildEmbedUrl(embed.platform, embed.url);
            const platformInfo = PLATFORMS.find((p) => p.id === embed.platform);
            return (
              <div key={embed.id}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-ink/60">
                    {platformInfo && (
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: platformInfo.brandBg }}
                      >
                        <img
                          src={platformInfo.imgSrc}
                          alt={platformInfo.label}
                          className="h-3 w-3 object-contain"
                          style={platformInfo.id === 'spotify' ? { filter: 'brightness(0) invert(1)' } : undefined}
                        />
                      </div>
                    )}
                    {platformInfo?.label}
                  </span>
                  <button
                    onClick={() => handleRemove(embed.id)}
                    className="text-xs font-semibold text-ink/40 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
                {embedUrl ? (
                  <div className="overflow-hidden rounded-xl2 border-2 border-ink">
                    <iframe
                      src={embedUrl}
                      width="100%"
                      height={height}
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      title={`${platformInfo?.label} playlist`}
                    />
                  </div>
                ) : (
                  <a
                
                    href={embed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-xl2 border-2 border-ink bg-white px-3 py-2 text-xs font-semibold underline"
                  >
                    {embed.url}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!adding ? (
        <div className="mt-5 grid grid-cols-4 gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setAdding(p.id);
                setError(null);
              }}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-black/8 bg-white/70 py-3 px-1 shadow-sm transition-all duration-150 hover:-translate-y-1 hover:shadow-md active:scale-95"
              title={p.label}
            >
              {/* Brand-coloured logo tile */}
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-sm"
                style={{ backgroundColor: p.brandBg }}
              >
                <img
                  src={p.imgSrc}
                  alt={p.label}
                  className="h-7 w-7 object-contain"
                  style={p.id === 'spotify' ? { filter: 'brightness(0) invert(1)' } : undefined}
                />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wide text-ink/50 group-hover:text-ink/80 transition-colors">
                {p.label.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleAdd} className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            {(() => {
              const p = PLATFORMS.find((pl) => pl.id === adding);
              return p ? (
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-lg overflow-hidden shadow-sm flex-shrink-0"
                  style={{ backgroundColor: p.brandBg }}
                >
                  <img
                    src={p.imgSrc}
                    alt={p.label}
                    className="h-5 w-5 object-contain"
                    style={p.id === 'spotify' ? { filter: 'brightness(0) invert(1)' } : undefined}
                  />
                </div>
              ) : null;
            })()}
            <p className="text-xs font-bold uppercase tracking-wide text-ink/60">
              {PLATFORMS.find((p) => p.id === adding)?.label}
            </p>
          </div>
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={PLATFORMS.find((p) => p.id === adding)?.placeholder}
            className="brutal-input text-sm"
            autoFocus
          />
          {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-pill-accent flex-1 justify-center text-sm"
            >
              {saving ? 'Adding…' : 'Add playlist'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(null);
                setError(null);
              }}
              className="btn-pill-ghost text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}