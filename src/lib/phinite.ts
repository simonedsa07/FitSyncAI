const PHINITE_AGENT_URL = process.env.PHINITE_AGENT_URL?.trim();
const PHINITE_API_KEY = process.env.PHINITE_API_KEY;

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

async function parsePhiniteResponse(res: Response) {
  const rawText = await res.text();
  let agentMessage = rawText;

  try {
    const parsed = JSON.parse(rawText);
    agentMessage = parsed.output || parsed.response || parsed.message || rawText;
  } catch {
    // If it fails to parse as JSON, it means it's pure plain text.
  }

  const playlistRegex = /playlist\/([a-zA-Z0-9]+)/;
  const match = agentMessage.match(playlistRegex);
  const playlistId = match ? match[1] : null;

  const spotifyPlaylistUrl = playlistId ? `https://open.spotify.com/playlist/${playlistId}` : null;

  return {
    spotifyPlaylistId: playlistId,
    spotifyPlaylistUrl,
    raw: agentMessage,
    otherLink: spotifyPlaylistUrl,
  };
}

export async function callPhiniteAgent(message: string) {
  if (!PHINITE_AGENT_URL) {
    throw new Error('PHINITE_AGENT_URL is not configured. Set it to the exact A2A URL shown in Phinite.');
  }

  validatePhiniteAgentUrl(PHINITE_AGENT_URL);

  if (!PHINITE_API_KEY) {
    throw new Error('Phinite API key is not configured');
  }

  let lastError: Error | null = null;

  for (const payload of [
    { body: JSON.stringify({ prompt: message }), contentType: 'application/json' },
    { body: message, contentType: 'text/plain' },
  ]) {
    try {
      const res = await fetch(PHINITE_AGENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': payload.contentType,
          'X-API-Key': PHINITE_API_KEY,
          Authorization: `Bearer ${PHINITE_API_KEY}`,
        },
        body: payload.body,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Phinite Error Details:', errorText);
        console.error('Phinite Request URL:', PHINITE_AGENT_URL);

        if (res.status === 404) {
          throw new Error(
            'Phinite API failed: 404. The configured Hosted Agent URL was not found by Phinite. Verify the agent is shared internally in your ORG and restart the Next dev server after changing PHINITE_AGENT_URL.'
          );
        }

        throw new Error(`Phinite API failed: ${res.status}`);
      }

      return await parsePhiniteResponse(res);
    } catch (error) {
      if (!(error instanceof Error)) {
        lastError = new Error('Unexpected Phinite request error');
      } else if (!lastError) {
        lastError = error;
      }

      // If this payload shape is unsupported, try the alternate plain-text/JSON form.
      if (error instanceof Error && /404/.test(error.message)) {
        continue;
      }

      throw error;
    }
  }

  throw lastError ?? new Error('Phinite request failed without a detailed error');
}
