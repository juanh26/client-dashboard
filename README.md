# Client Dashboard

Next.js client-facing dashboard for showing PulpSense delivery progress from ClickUp without exposing raw ClickUp data.

GitHub: `https://github.com/juanh26/client-dashboard`

## Stack

- Next.js App Router with strict TypeScript
- shadcn/ui, fully installed up front
- Vitest for fast unit tests
- ESLint, Prettier, Secretlint, Husky, and lint-staged
- Vercel target deployment

## Design Source

- `DESIGN.md` is the canonical source of truth for visual direction, tokens, and implementation guidance.
- The design direction comes from a Google Stitch extraction of `https://www.pulpsense.com/`.
- shadcn/ui is the local component source, not the brand direction. Adapt generated components to `DESIGN.md`.
- PulpSense logo asset: `public/pulpsense-logo.svg`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/admin` for the all-client admin view or `http://localhost:3000/clients/foodready` for a single-client view.

## Quality Gates

```bash
npm run secrets:check
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run validate` runs the full local gate.

## Visual QA

Start the local server, then capture route screenshots:

```bash
npm run dev
DASHBOARD_ROUTES="/clients/foodready /admin" npm run screenshots
```

Screenshots are written to `../docs/snapshots/` by default. Override the server URL with `DASHBOARD_BASE_URL` and the output directory with `DASHBOARD_SCREENSHOT_DIR`.

## UI Rule

All shadcn/ui components are installed in `src/components/ui/`. Reuse or compose those components before adding custom primitives. Dashboard-specific components belong in `src/components/dashboard/`.

The current shadcn CLI did not materialize a `form.tsx` file when asked for `form`; if form work starts later, run the current shadcn form setup for that CLI version and document the generated pattern before building custom form primitives.

## Data Safety

Raw ClickUp data must stay server-side. Browser components should receive only projected dashboard DTOs from `src/dashboard/` or a future server-only ClickUp data access layer.

External data enters the app as `unknown`, is validated, then narrowed into typed dashboard models. Do not use explicit `any`.

## Environment

- `CLICKUP_API_TOKEN` - optional server-side ClickUp token for live reads.

Live ClickUp reads are controlled per client in `src/config/clients.ts`. Mock fallback is used when `CLICKUP_API_TOKEN` is missing, a live read fails, or a secondary widget does not yet have a real source.

## Current State

- Shared dashboard surface for `/admin` and real client routes such as `/clients/foodready`
- `/admin` is currently open for demo access.
- Typed dashboard task model and summary metrics
- Vitest coverage for dashboard metrics
- Pre-commit hook for secrets, formatting/linting, typecheck, and tests
- shadcn component set installed
- Vercel preview deployment is linked under `juanh-2807` / `juan-cruz-s-projects1`
