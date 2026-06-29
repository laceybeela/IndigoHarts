# IndigoHarts - Project Context

## Overview
Property management and cleaning job scheduling system for a hospitality/vacation rental business. Monorepo with a web admin portal, mobile employee app, and shared packages.

## Tech Stack
- **Monorepo**: pnpm workspaces + Turborepo
- **Web Admin**: Next.js 14 (App Router), React 18, TailwindCSS
- **Mobile App**: React Native (Expo SDK 54, Expo Router), NativeWind
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- **State**: TanStack React Query, React Context (auth)
- **Forms**: react-hook-form + Zod validation
- **SMS**: Twilio (via Supabase Edge Functions)
- **Styling**: TailwindCSS with custom preset (sage/floral color palette, Poppins font)

## Architecture

```
apps/
  web/          # Next.js admin portal (property/job/guest/stay management)
  mobile/       # Expo app for employees (job viewing, checklist completion)
packages/
  config/       # Shared Tailwind preset and theme
  hooks/        # Shared React hooks (useAuth, useProperties, useCleaningJobs, useMyJobs)
  services/     # Supabase service layer (all CRUD operations)
  types/        # TypeScript types, enums, Zod schemas
  ui/           # Shared UI exports and theme object
supabase/       # Migrations, Edge Functions, seed data
```

## Data Model (key entities)
- **Users** - admin or employee role, soft-delete via is_active
- **Properties** - vacation rentals with access codes, wifi info
- **Guests** - contact info for property guests
- **Stays** - guest bookings at properties (upcoming → checked_in → checked_out/cancelled)
- **CleaningJobs** - assigned to employees (assigned → accepted → in_progress → completed)
- **Checklists** - templates per property, auto-copied to jobs via `copy_checklist_to_job` RPC
- **SMS** - templates with variable substitution, sent via Twilio Edge Function
- **EmployeeAvailability** - per-employee per-date availability tracking

## Key Patterns
- Services accept a Supabase client as first arg: `getProperties(client, includeInactive?)`
- Hooks wrap services with React Query: `useProperties()`, `useCleaningJobs(filters?)`
- Web-specific hooks live in `apps/web/src/hooks/` (stays, guests, employees, SMS, checklists, availability)
- Shared hooks live in `packages/hooks/src/` (auth, properties, cleaning jobs)
- Zod schemas exist for all create/update operations in `packages/types/src/schemas.ts`
- Soft deletes for properties and checklist templates (is_active flag)
- Job status transitions auto-set timestamps (accepted_at, started_at, completed_at)

## Commands
```bash
pnpm dev:web          # Start web admin (Next.js)
pnpm dev:mobile       # Start mobile app (Expo)
pnpm build            # Build all packages
pnpm typecheck        # TypeScript check all packages
pnpm lint             # Lint all packages
pnpm db:reset         # Reset Supabase database
pnpm db:types         # Regenerate database types from Supabase
```

## Web Admin Portal Routes
- `/dashboard` - Stats overview + recent activity
- `/properties` - CRUD + checklist template management
- `/guests` - CRUD with stay history
- `/stays` - CRUD with status management, linked to properties/guests
- `/jobs` - CRUD with status tabs, checklist interaction, employee assignment
- `/employees` - Create (via Edge Function), activate/deactivate
- `/availability` - Weekly grid for employee scheduling
- `/sms` - Templates with variables, send with preview, message log
- `/settings` - Account info (read-only)

## Mobile App Routes
- `/(auth)/login` - Email/password authentication
- `/(app)/jobs` - Job list (Today/Upcoming sections)
- `/(app)/jobs/[id]` - Job detail with interactive checklists
- `/(app)/profile` - User info + sign out

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Style Guide
- Colors: sage (primary #C8D97A/#6B7F3A), floral (accent #E86AA6/#AC2358), warm-white (#FAFAF7)
- Font: Poppins (300-700 weights)
- Border radius: 12px default
- Use existing UI components from `apps/web/src/components/ui/` or `apps/mobile/src/components/ui/`
