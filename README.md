# Client Progress Dashboard

Next.js client-facing dashboard for showing PulpSense delivery progress from ClickUp without exposing raw ClickUp data.

## Stack

- Next.js App Router with strict TypeScript
- shadcn/ui, fully installed up front
- Vitest for fast unit tests
- ESLint, Prettier, Secretlint, Husky, and lint-staged
- Vercel target deployment

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000/clients/demo`.

## Quality Gates

```bash
npm run secrets:check
npm run lint
npm run typecheck
npm run test
npm run build
```

`npm run validate` runs the full local gate.

## UI Rule

All shadcn/ui components are installed in `src/components/ui/`. Reuse or compose those components before adding custom primitives. Dashboard-specific components belong in `src/components/dashboard/`.

## Data Safety

Raw ClickUp data must stay server-side. Browser components should receive only projected dashboard DTOs from `src/dashboard/` or a future server-only ClickUp data access layer.

External data enters the app as `unknown`, is validated, then narrowed into typed dashboard models. Do not use explicit `any`.

## Current State

- Static demo dashboard route: `/clients/demo`
- Typed dashboard task model and summary metrics
- Vitest coverage for dashboard metrics
- Pre-commit hook for secrets, formatting/linting, typecheck, and tests
- shadcn component set installed
- Vercel connection still requires authenticated project linking
