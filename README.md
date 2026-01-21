# Loan EMI Calculator — Developer Quickstart

This repository contains the Loan EMI Calculator monorepo (web UI, shared business logic, and API adapters).

Quick bootstrap (local developer):

Prerequisites
- Node 18+ (or the project's supported Node version)
- pnpm (recommended) or npm
- firebase-tools (for Firestore emulator) if you plan to run the local emulator

Start Firestore emulator (optional, recommended for local persistence):

```bash
# Install firebase-tools if needed
npm install -g firebase-tools

# From repo root: start emulator (runs Firestore on localhost:8080 by default)
firebase emulators:start --only firestore --project=lemic-app
```

Idempotent seed (recommended):

Run the idempotent seed script to synchronize loan templates into the Firestore emulator or a live Firestore instance (if you have credentials configured).

```bash
# Ensure env points to the emulator (for local dev)
export FIRESTORE_EMULATOR_HOST=localhost:8080
export API_ADAPTER=firestore

# Using pnpm workspaces (preferred)
pnpm --filter @loan-calc/api run seed

# Or from apps/api
cd apps/api && npm run seed
```

Expected seed stdout (when emulator is running):

```text
[Firestore] Emulator detected at localhost:8080
[Seed] personal-loan: UPDATED
[Seed] solar-install-loan: UPDATED
[Seed] Success: 2 loan templates synchronized.
```

Run tests

- Shared package unit tests (Zod + EMI engine):
  ```bash
  cd packages/shared
  npm test
  ```

- Web package tests (vitest + jsdom):
  ```bash
  cd apps/web
  npm test
  ```

- Playwright E2E (intercepts API, CI-friendly):
  ```bash
  npx playwright test apps/web/tests/calculator.e2e.spec.ts
  ```

Environment
- See `apps/api/.env.example` for recommended environment variables. Do NOT commit real credentials. The API expects a base64-encoded GCP service account in `FIREBASE_SERVICE_ACCOUNT` when running against production Firestore.

Deploy
- Deployment commands depend on your hosting target. Example (replace with your infra pipeline):
  ```bash
  # Build web
  pnpm --filter @loan-calc/web run build

  # Deploy (placeholder - adapt to your CI/CD)
  pnpm --filter @loan-calc/web run deploy
  ```

If you need help with CI secrets or setting up the emulator, see `apps/api/.env.example` and the `apps/api/scripts/seedLoanTemplates.ts` file for examples.
