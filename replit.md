# Portfolio Tracker

A mobile app for tracking and managing portfolio projects, built with Expo (React Native) and Supabase for auth + database.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Expo app: restart workflow `artifacts/portfolio-tracker: expo`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (React Native) with Expo Router
- Auth + DB: Supabase (email/password auth, PostgreSQL)
- UI: @expo/vector-icons (Feather), Inter font, custom color tokens
- State: React Query + React Context (AuthContext)

## Where things live

- `artifacts/portfolio-tracker/` — Expo mobile app
- `artifacts/portfolio-tracker/app/` — Expo Router screens
- `artifacts/portfolio-tracker/app/(auth)/` — Login & Register screens
- `artifacts/portfolio-tracker/app/(tabs)/` — Home (projects), Dashboard, Profile tabs
- `artifacts/portfolio-tracker/app/add-project.tsx` — Add project modal
- `artifacts/portfolio-tracker/components/ProjectCard.tsx` — Reusable project card
- `artifacts/portfolio-tracker/components/SkeletonLoader.tsx` — Loading skeletons
- `artifacts/portfolio-tracker/context/AuthContext.tsx` — Supabase auth state
- `artifacts/portfolio-tracker/services/supabaseClient.ts` — Supabase client (lazy, guards missing env vars)
- `artifacts/portfolio-tracker/constants/colors.ts` — Indigo color palette
- `artifacts/portfolio-tracker/types/index.ts` — Project type definitions

## Architecture decisions

- Supabase client is conditionally initialized: `isSupabaseConfigured` flag prevents crash when env vars are missing; shows a setup screen instead.
- Auth routing via `useSegments` + `useEffect` in root `_layout.tsx` — redirects between `(auth)` and `(tabs)` groups based on session state.
- Row Level Security enabled on `projects` table — users can only access their own rows.
- `EXPO_PUBLIC_` prefix on Supabase env vars so they're available in the Expo client bundle.

## Product

Users can register/login with email+password, add portfolio projects (title + URL), view them as cards with an "Open Project" button, delete projects, search/filter the list, and see dashboard stats (total, added this week/month, recent projects).

## Supabase setup

Run this SQL in Supabase → SQL Editor:

```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now() not null
);

alter table projects enable row level security;

create policy "Users can manage own projects" on projects
  for all using (auth.uid() = user_id);
```

Required env vars (set in Replit Secrets / shared env):
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Gotchas

- Restart the `artifacts/portfolio-tracker: expo` workflow (not `pnpm dev`) — the workflow injects required env vars.
- After changing any env var, restart the Expo workflow for the new value to take effect in the bundle.
- `useNativeDriver` Animated warnings on web are harmless — native driver works correctly on iOS/Android.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
