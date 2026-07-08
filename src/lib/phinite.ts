const PHINITE_AGENT_URL = process.env.PHINITE_AGENT_URL?.trim();
const PHINITE_API_KEY = process.env.PHINITE_API_KEY;

export type MusicPlan = Record<string, unknown>;

export interface PhinitePlaylistResult {
  spotify_playlist_link: string | null;
  playlist_name: string | null;
  track_count: number | null;
  playlist_duration: number | null;
  music_plan: MusicPlan | null;
  raw: string;
}

export type PhiniteAgentInput =
  | { prompt: string; music_plan?: never }
  | { music_plan: MusicPlan; prompt?: never };

function validatePhiniteAgentUrl(url: string) {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    throw new Error(
      'PHINITE_AGENT_URL must be a valid full URL from Phinite, including both flowId and registryId.'
    );
  }

  const pathParts = parsed.pathname.split('/').filter(Boolean);
  const a2aIndex = pathParts.findIndex((part, index) => {
    return part === 'a2a' && pathParts[index - 1] === 'ai';
  });

  if (a2aIndex === -1 || pathParts.length - a2aIndex - 1 < 2) {
    throw new Error(
      'PHINITE_AGENT_URL must be the exact A2A agent URL from Phinite, including both flowId and registryId.'
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function asNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function findPlaylistLink(value: unknown) {
  const direct = asString(value);
  if (direct?.includes('open.spotify.com/playlist/')) {
    return direct;
  }

  if (typeof value !== 'string') {
    return null;
  }

  return value.match(/https:\/\/open\.spotify\.com\/playlist\/[A-Za-z0-9]+/)?.[0] ?? null;
}

async function parsePhiniteResponse(res: Response): Promise<PhinitePlaylistResult> {
  const rawText = await res.text();
  let parsed: unknown = rawText;

  try {
    parsed = JSON.parse(rawText);
  } catch {
    // Plain-text responses are normalized below.
  }

  if (isRecord(parsed)) {
    parsed = parseMaybeJson(parsed.output ?? parsed.response ?? parsed.message ?? parsed.result ?? parsed);
  }

  const body = isRecord(parsed) ? parsed : {};
  const raw = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
  const spotifyPlaylistLink =
    findPlaylistLink(body.spotify_playlist_link) ??
    findPlaylistLink(body.spotifyPlaylistLink) ??
    findPlaylistLink(body.playlist_url) ??
    findPlaylistLink(body.url) ??
    findPlaylistLink(raw);

  const musicPlan = isRecord(body.music_plan) ? body.music_plan : null;

  return {
    spotify_playlist_link: spotifyPlaylistLink,
    playlist_name: asString(body.playlist_name) ?? asString(body.name),
    track_count: asNumber(body.track_count),
    playlist_duration: asNumber(body.playlist_duration) ?? asNumber(body.duration),
    music_plan: musicPlan,
    raw,
  };
}

export async function callPhiniteAgent(input: PhiniteAgentInput) {
  if (!PHINITE_AGENT_URL) {
    throw new Error('PHINITE_AGENT_URL is not configured. Set it to the exact A2A URL shown in Phinite.');
  }

  validatePhiniteAgentUrl(PHINITE_AGENT_URL);

  if (!PHINITE_API_KEY) {
    throw new Error('Phinite API key is not configured');
  }

  const res = await fetch(PHINITE_AGENT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': PHINITE_API_KEY,
      Authorization: `Bearer ${PHINITE_API_KEY}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Phinite Error Details:', errorText);
    console.error('Phinite Request URL:', PHINITE_AGENT_URL);

    let errorMessage = `Phinite API failed: ${res.status}`;
    const parsedError = parseMaybeJson(errorText);
    if (isRecord(parsedError) && typeof parsedError.error === 'string') {
      errorMessage = parsedError.error;
    }

    if (res.status === 404) {
      errorMessage =
        'Phinite API failed: 404. The configured Hosted Agent URL was not found by Phinite. Verify the agent is shared internally in your ORG and restart the Next dev server after changing PHINITE_AGENT_URL.';
    }

    throw new Error(errorMessage);
  }

  return parsePhiniteResponse(res);
}
