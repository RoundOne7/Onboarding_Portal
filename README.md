# Doctor Onboarding Portal

A polished onboarding dashboard for hospital operations teams to manage doctors, hospitals, schedules, and appointment capacity using a modern Next.js stack.

## What it does

This portal streamlines the medical onboarding lifecycle by giving hospital admins a centralized interface to:

- manage doctor profiles and schedules
- register new hospitals and connect resources
- configure appointment slot availability
- maintain operational settings for the platform

The design focuses on a clean administrative experience with reusable UI components and fast data access via Supabase.

## Why it matters

Healthcare administration workflows often rely on spreadsheets and disconnected tools. This project illustrates a more maintainable onboarding solution for staffing teams and operations managers, enabling faster doctor activation and better hospital coordination.

## Core Features

- Dashboard landing page with quick access to doctors, hospitals, and settings
- Doctor directory with add/edit workflow and nested schedule/slot navigation
- Hospital registry with add hospital flow
- Dedicated settings page for global configuration
- Supabase-backed data layer for persistence and integration
- Type-safe forms using `react-hook-form` with `zod` validation
- Responsive layout optimized for admin use

## Pages and Routes

- `/dashboard` — main dashboard overview
- `/doctors` — doctor listings
- `/doctors/add` — add new doctor form
- `/doctors/[id]/schedule` — doctor schedule detail page
- `/doctors/[id]/slots` — doctor appointment slot detail page
- `/hospitals` — hospital listing page
- `/hospitals/add` — register a new hospital
- `/settings` — application settings and configuration

## Architecture

- `app/` — Next.js App Router pages and route structure
- `components/` — reusable UI elements for layout, forms, and data lists
- `src/lib/supabase.ts` — Supabase client initialization
- `services/` — business logic and API helper functions
- `hooks/` — shared React hooks for state and behavior
- `public/` — static assets
- `src/app/globals.css` — global styling and Tailwind configuration

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase JavaScript SDK
- react-hook-form
- zod
- lucide-react
- clsx

## Setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start development

```bash
npm run dev
```

4. Open browser

Navigate to `http://localhost:3000`

## Environment Variables

Required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are consumed in `src/lib/supabase.ts`.

## Scripts

- `npm run dev` — start development server
- `npm run build` — compile the app for production
- `npm run start` — start the production server
- `npm run lint` — run linting

## Deployment

Deploy on any Next.js host such as Vercel, Netlify, or a custom container.


## Future Improvements

- add user authentication and role-based access control
- connect real Supabase tables and row-level security policies
- add doctor availability calendar and appointment booking flows
- support hospital-level settings and multi-tenant workflows

## Notes

- The project is currently configured as a private repository in `package.json`.

