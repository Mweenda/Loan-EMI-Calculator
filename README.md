# Loan EMI Calculator

A professional-grade **monorepo** for calculating loan EMI (Equated Monthly Installment) with strict type safety, automated testing, and production-level quality gates.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Development Workflow](#development-workflow)
- [Testing & Quality](#testing--quality)
- [Security & Compliance](#security--compliance)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **pnpm** 8.0.0+ (see [pnpm installation](https://pnpm.io/installation))

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mweenda/Loan-EMI-Calculator.git
   cd Loan-EMI-Calculator
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

   The calculator UI will be available at `http://localhost:5173` (Vite default).

---

## Project Architecture

This is a **PNPM Monorepo** with the following structure:

```
loan-emi-calculator-monorepo/
├── apps/
│   └── web/                    # React + Vite frontend
│       ├── src/
│       │   ├── pages/          # Page components (Calculator.tsx)
│       │   └── components/     # shadcn/ui components
│       └── tests/              # E2E tests (Playwright)
├── packages/
│   └── shared/                 # Shared business logic
│       ├── src/
│       │   └── index.ts        # EMI formula & Zod schema
│       └── tests/              # Unit tests (Vitest)
├── turbo.json                  # Turborepo pipeline config
├── pnpm-workspace.yaml         # PNPM workspace definition
├── tsconfig.json               # Root TypeScript config (strict mode)
├── .eslintrc.json              # ESLint rules
├── .prettierrc                 # Prettier formatting rules
└── .github/workflows/          # CI/CD pipelines
    ├── pipeline.yml            # Build, test, deploy
    └── security.yml            # Weekly audit
```

### Packages

#### `@shared` - Business Logic

The "source of truth" for EMI calculations. Contains:
- **Zod Schema** for input validation
- **EMI Formula** implementation
- **Unit Tests** with ≥80% coverage

**Usage:**
```typescript
import { calculateEMI, LoanInputSchema } from '@shared/index';

const result = calculateEMI({
  principal: 100000,
  annualRate: 12,
  tenureMonths: 12,
});
// Output: 8884.88
```

#### `@web` - Frontend

React + Vite frontend with **shadcn/ui** and **Tailwind CSS**. Uses **React Hook Form** for state management.

---

## Development Workflow

### Available Commands

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build all packages

# Testing
pnpm test             # Run all tests (Vitest)
pnpm test:coverage    # Generate coverage report
pnpm e2e              # Run Playwright E2E tests

# Code Quality
pnpm lint             # Run ESLint across monorepo
pnpm format           # Auto-format with Prettier
pnpm typecheck        # Run TypeScript type-check

# Security
pnpm audit            # Check for vulnerable dependencies
```

### Path Aliases

The monorepo uses path aliases to avoid brittle relative imports:

```typescript
// ✅ Good
import { calculateEMI } from '@shared/index';

// ❌ Avoid
import { calculateEMI } from '../../packages/shared/src/index';
```

Configure your IDE (VSCode) to recognize these aliases by using the `baseUrl` and `paths` in `tsconfig.json`.

### Pre-commit Hooks

Every commit is automatically checked by **Husky** and **lint-staged**:

1. **Lint** - ESLint verifies no `any` types and follows style rules
2. **Format** - Prettier auto-formats code
3. **Type-check** - TypeScript ensures no implicit types

If checks fail, the commit is blocked. Fix issues and try again.

```bash
# To bypass hooks (not recommended)
git commit --no-verify
```

---

## Testing & Quality

### Unit Tests (Vitest)

Located in `packages/shared/src/__tests__/`:

```bash
pnpm test
```

**Example test:**
```typescript
import { describe, it, expect } from 'vitest';
import { calculateEMI } from '../index';

describe('EMI Formula', () => {
  it('calculates correctly for benchmark case', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8884.88, 2);
  });
});
```

### E2E Tests (Playwright)

Located in `apps/web/tests/`:

```bash
pnpm e2e
```

Tests simulate real user interactions:
- Form input and submission
- Validation error handling
- Result display accuracy

### Coverage Target

We maintain **≥80% statement coverage** across all packages. Check coverage:

```bash
pnpm test:coverage
```

---

## Security & Compliance

### Dependency Scanning

A **weekly automated audit** runs every Monday at 00:00 UTC via GitHub Actions. Vulnerabilities are reported immediately.

**Manual audit:**
```bash
pnpm audit --audit-level=high
```

### Secrets Management

Environment variables are validated at runtime using **Zod** (see `tsconfig` for `T3 Env` integration).

**Never commit secrets.** Use GitHub Secrets for sensitive data.

### TypeScript Strict Mode

All code must comply with strict TypeScript rules:
- ✅ No implicit `any`
- ✅ No unused variables
- ✅ No unused parameters
- ✅ Explicit null/undefined handling

---

## Deployment

### Preview Deployments

PRs automatically generate preview deployments via GitHub Actions (Firebase Hosting).

### Production Deployment

Merges to `main` trigger:
1. **Quality Gate** (lint, typecheck, tests)
2. **Turbo Build** (optimized caching)
3. **Automated Changelog** (via Changesets)
4. **Production Deployment** (Firebase Hosting)

---

## Contributing

### Branch Naming

Follow conventional names:
- `feature/calculator-ui`
- `fix/emi-formula-precision`
- `chore/upgrade-dependencies`

### Commit Messages

Use semantic commits:
```
feat: add dark mode to calculator
fix: correct EMI formula rounding
docs: update README setup instructions
```

### Architecture Decision Records (ADRs)

For significant decisions, create an ADR in `docs/adr/`:

```
docs/adr/001-use-zod-for-validation.md
```

### Pull Request Checklist

- [ ] Tests pass (`pnpm test`)
- [ ] Types check (`pnpm typecheck`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] Changes documented in PR description
- [ ] Related issue linked

---

## Team Accountability

| Requirement | Tool | Automation |
| --- | --- | --- |
| Type Safety | TypeScript + ESLint | Pre-commit hook |
| Code Format | Prettier | Pre-commit hook |
| Unit Tests | Vitest | CI/CD pipeline |
| E2E Tests | Playwright | CI/CD pipeline |
| Dependency Audit | pnpm audit | Weekly workflow |
| Lint Rules | ESLint + perfectionist | Pre-commit hook |

---

## Troubleshooting

### `pnpm install` fails

Ensure you have **pnpm 8.0.0+** installed:
```bash
pnpm --version
pnpm add -g pnpm@latest
```

### Pre-commit hook not working

Reinstall Husky:
```bash
pnpm add -Dw husky
npx husky install
```

### Type errors in IDE

Restart your TypeScript server (VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server").

---

## Resources

- [Turborepo Documentation](https://turbo.build/)
- [Zod Validation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Playwright E2E Testing](https://playwright.dev/)
- [Vitest Unit Testing](https://vitest.dev/)

---

## License

MIT © [Mweenda](https://github.com/Mweenda)
