import { supabase } from '@/lib/supabaseClient';
import type { MusicPlatform } from '@/lib/musicEmbed';

export interface MusicEmbedRecord {
  id: string;
  platform: MusicPlatform;
  url: string;
  label: string | null;
  created_at: string;
}

export async function fetchMusicEmbeds(userId: string): Promise<MusicEmbedRecord[]> {
  const { data, error } = await supabase
    .from('music_embeds')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function saveMusicEmbed(platform: MusicPlatform, url: string, label?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('music_embeds')
    .insert({ user_id: user.id, platform, url, label: label || null })
    .select()
    .single();

  if (error) throw error;
  return data as MusicEmbedRecord;
}

export async function deleteMusicEmbed(id: string) {
  const { error } = await supabase.from('music_embeds').delete().eq('id', id);
  if (error) throw error;
}