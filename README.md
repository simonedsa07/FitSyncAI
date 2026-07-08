# FitSyncAI

An AI-powered fitness planner: workout plans, progress tracking, a chat coach, and
Spotify-matched playlists — built with Next.js (App Router), Supabase, Zustand, and Tailwind.

## Design system

Neubrutalist look pulled from the reference recording: thick black borders, hard offset
drop-shadows, pill-shaped buttons/chips, bold rounded display type, and 4 switchable
pastel accent themes (Soft Pink, Mint Green, Lavender, Sky Blue) controlled from the
palette icon in the navbar. Theme tokens live in `src/styles/globals.css` and
`src/themes/colors.ts`.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings.
- `SUPABASE_SERVICE_ROLE_KEY` — used server-side only (Spotify token storage and admin DB access).
- `PHINITE_AGENT_URL` — the full Phinite A2A agent URL from your workspace Agent Registry. For test builds this usually includes both `flowId` and `registryId` (e.g. `https://app.phinite.ai/api/v1/ai/a2a/{flowId}/{registryId}`).
- `PHINITE_API_KEY` — the Phinite API key used for playlist generation. This is sent as `X-API-Key` when invoking A2A agents.
- `OPENAI_API_KEY` — powers the `/api/chat` coach.
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` / `SPOTIFY_REDIRECT_URI` — from a Spotify
  Developer app. Redirect URI must match exactly, e.g. `http://localhost:3000/api/spotify/callback`.
- `NEXT_PUBLIC_SITE_URL` — your app origin.

## 3. Set up the database

Run `supabase/schema.sql` in the Supabase SQL editor. It creates `profiles`,
`workout_plans`, `workout_logs`, `weight_logs`, `chat_messages`, `spotify_tokens`, and
`reminders`, all with row-level security scoped to `auth.uid()`.

## 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000` → sign up → onboarding wizard → dashboard.

## Folder structure

Matches the requested layout: route groups for `(auth)` and `(main)`, API routes under
`app/api/*`, and `components/lib/store/hooks/services/themes/types/styles` split by
responsibility. One addition beyond the original spec: `app/(main)/progress/page.tsx` —
the recording shows a "Progress" tab (weight trend + workout history) that the API routes
(`api/progress`, `api/progress/log`) already implied, so its page was added to complete
the flow.

## Notes / next steps

- `api/workout/generate` uses a simple rule-based template (Full Body / Cardio / Rest)
  matched to `days_per_week`. Swap in an LLM call there for fully personalized plans.
- Spotify playlist creation uses genre search as a stand-in for real audio-feature based
  matching — refine with the Recommendations API if you have extended API access.
- Middleware (`src/middleware.ts`) protects `/dashboard`, `/workout`, `/chat`,
  `/progress`, `/profile`, and `/onboarding` behind auth.
