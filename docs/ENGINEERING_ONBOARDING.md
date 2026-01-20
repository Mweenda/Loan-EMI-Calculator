# 🏦 Loan EMI Calculator - Engineering Onboarding Guide

> **Welcome to the Loan EMI Calculator monorepo.** This is a production-grade financial application built with strict type safety, automated testing, and a zero-regression quality policy. Every engineer—regardless of experience level—should be able to clone this repo and be productive within **5 minutes**.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Philosophy](#project-philosophy)
3. [Architecture Overview](#architecture-overview)
4. [Development Workflow](#development-workflow)
5. [Quality Standards](#quality-standards)
6. [Task 1: EMI Formula Implementation](#task-1-emi-formula-implementation)
7. [Testing & Verification](#testing--verification)
8. [Common Commands](#common-commands)
9. [Troubleshooting](#troubleshooting)
10. [Contributing](#contributing)

---

## 🚀 Quick Start

### 1. Prerequisites

**Required:**
- Node.js v18+ (LTS recommended)
- PNPM 8.0.0+ ([Install Guide](https://pnpm.io/installation))
- Git

**Optional (but recommended):**
- VS Code with ESLint and Prettier extensions
- Playwright Browser (auto-installed by `pnpm install`)

### 2. Clone & Install (< 2 minutes)

```bash
# Clone the repository
git clone https://github.com/Mweenda/Loan-EMI-Calculator.git
cd Loan-EMI-Calculator

# Switch to develop branch (for feature work)
git checkout develop

# Install all dependencies (including dev tools)
pnpm install
```

### 3. Start Development (< 1 minute)

```bash
# Start the dev server
pnpm dev

# In another terminal, watch for changes
pnpm test:watch
```

The calculator UI will be available at `http://localhost:5173`.

---

## 🎯 Project Philosophy

This project enforces **"Exceptional" (Level 5)** standards across all dimensions:

| Pillar | Standard | How We Enforce |
| --- | --- | --- |
| **Type Safety** | 100% strict TypeScript | Pre-commit hooks block `any` types |
| **Quality** | ≥80% test coverage | CI/CD fails without coverage |
| **Security** | Zero vulnerabilities | Weekly automated audits |
| **Accessibility** | WCAG 2.1 AA | Built on Radix primitives |
| **Performance** | <100ms calculations | Turbo caching + React Hook Form |
| **Reliability** | Zero regressions | All features must have tests |

---

## 🏗 Architecture Overview

### Monorepo Structure

```
loan-emi-calculator-monorepo/
│
├── 📦 apps/
│   └── web/
│       ├── src/
│       │   ├── pages/
│       │   │   └── Calculator.tsx        ← Main calculator component
│       │   ├── components/               ← shadcn/ui components
│       │   └── hooks/                    ← Custom React hooks
│       ├── tests/
│       │   └── calculator.e2e.spec.ts    ← Playwright E2E tests
│       └── package.json
│
├── 📦 packages/
│   └── shared/
│       ├── src/
│       │   ├── index.ts                  ← EMI formula + Zod schema
│       │   └── __tests__/
│       │       └── index.test.ts         ← Vitest unit tests
│       └── package.json
│
├── 📄 Configuration Files
│   ├── package.json                      ← Root workspace config
│   ├── tsconfig.json                     ← Strict TypeScript rules
│   ├── turbo.json                        ← Build orchestration
│   ├── .eslintrc.json                    ← Code quality rules
│   ├── .prettierrc                       ← Code formatting
│   └── pnpm-workspace.yaml               ← Workspace definition
│
├── 🔧 Git Hooks
│   └── .husky/pre-commit                 ← Automatic checks
│
└── 📚 Documentation
    ├── README.md                         ← This file
    ├── TECHNICAL_DESIGN_DOCUMENT.md      ← Architecture decisions
    └── docs/adr/                         ← Architecture Decision Records
```

### The Three Layers

#### 1. **Shared Logic** (`packages/shared`)

The "source of truth" for all EMI calculations. Highly testable, framework-agnostic.

```typescript
// packages/shared/src/index.ts
import { z } from 'zod';

// Input validation
export const LoanInputSchema = z.object({
  principal: z.number().min(1, 'Principal is required'),
  annualRate: z.number().min(0.1, 'Rate must be positive'),
  tenureMonths: z.number().int().min(1, 'Tenure must be at least 1 month'),
});

export type LoanInput = z.infer<typeof LoanInputSchema>;

// EMI Formula: EMI = [P * R * (1+R)^N] / [(1+R)^N - 1]
export const calculateEMI = (data: LoanInput): number => {
  const { principal, annualRate, tenureMonths } = data;
  const r = annualRate / (12 * 100); // Monthly interest rate
  const power = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * power) / (power - 1);
  return emi;
};
```

#### 2. **Frontend** (`apps/web`)

The user-facing interface built with React, Vite, and shadcn/ui. Consumes logic from `@shared`.

```typescript
// apps/web/src/pages/Calculator.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanInputSchema, calculateEMI } from '@shared/index';

export const LoanCalculatorPage = () => {
  const form = useForm({ resolver: zodResolver(LoanInputSchema) });
  const [emiResult, setEmiResult] = React.useState<number | null>(null);

  const onSubmit = (data: LoanInput) => {
    setEmiResult(calculateEMI(data));
  };

  return (
    // UI with form fields and result display
  );
};
```

#### 3. **Quality Gate** (CI/CD + Pre-commit)

Automated checks ensure no unsafe code reaches production.

```bash
# Pre-commit (Local)
Lint → Format → Type-check → Block if failed

# CI/CD (GitHub Actions)
Test → Build → E2E → Deploy (only if all pass)
```

---

## 🛠 Development Workflow

### Branch Strategy

```
main (production)
 ↑
 └── pull_request from develop
      ↑
      └── develop (integration branch)
           ↑
           └── feature/xyz (your feature branch)
```

### Step-by-Step: Adding a Feature

#### 1. Create a Feature Branch

```bash
# Sync with latest develop
git checkout develop
git pull origin develop

# Create your feature branch
git checkout -b feature/my-feature-name
```

#### 2. Implement & Test Locally

```bash
# Make your code changes
# Example: Update EMI formula

# Run linting (catches errors)
pnpm lint

# Run type-checking
pnpm typecheck

# Run unit tests
pnpm test

# Run E2E tests
pnpm e2e
```

#### 3. Commit with Confidence

**Pre-commit hooks will automatically:**
- ✅ Run ESLint (fix formatting)
- ✅ Run Prettier (format code)
- ✅ Verify TypeScript types
- ✅ Block commit if checks fail

```bash
# Add changes
git add .

# Commit (hooks run automatically)
git commit -m "feat: improve EMI formula precision"
```

#### 4. Push & Create Pull Request

```bash
# Push to your feature branch
git push origin feature/my-feature-name

# Go to GitHub and create a PR against `develop`
```

**What happens next:**
- CI/CD pipeline runs all tests
- Code review requested
- Once approved, merge to `develop`
- Later, promote `develop` → `main` after manual testing

---

## ✅ Quality Standards

### Type Safety (Non-Negotiable)

**Rule**: No implicit `any`. Ever.

```typescript
// ❌ WILL FAIL PRE-COMMIT
const processInput = (data: any) => {
  return data.principal * 2;
};

// ✅ CORRECT
import { LoanInput } from '@shared/index';
const processInput = (data: LoanInput) => {
  return data.principal * 2;
};
```

### Code Formatting

**Prettier enforces a standard style automatically.**

```bash
# Auto-format on commit (via pre-commit hook)
# Or manually:
pnpm format
```

### Testing Requirements

| Test Type | Coverage | Tool | Location |
| --- | --- | --- | --- |
| **Unit** | ≥80% | Vitest | `packages/shared/__tests__/` |
| **E2E** | Happy path + errors | Playwright | `apps/web/tests/` |
| **Integration** | Core workflows | Turbo + Vitest | Multiple |

**Example Unit Test:**

```typescript
// packages/shared/src/__tests__/index.test.ts
import { describe, it, expect } from 'vitest';
import { calculateEMI } from '../index';

describe('EMI Calculation', () => {
  it('calculates EMI for benchmark case', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8884.88, 2);
  });

  it('throws error for negative principal', () => {
    expect(() => {
      calculateEMI({
        principal: -1000,
        annualRate: 12,
        tenureMonths: 12,
      });
    }).toThrow();
  });
});
```

---

## 📐 Task 1: EMI Formula Implementation

### The Formula

$$\text{EMI} = \frac{P \times R \times (1+R)^N}{(1+R)^N - 1}$$

**Parameters:**
- **P** = Principal (loan amount in currency units)
- **R** = Monthly interest rate = (Annual Rate ÷ 12 ÷ 100)
- **N** = Tenure (number of months)

### Example Calculation

```
Principal: 100,000 ZMW
Annual Rate: 12%
Tenure: 12 months

R = 12 / 12 / 100 = 0.01
N = 12
power = (1.01)^12 ≈ 1.1268
EMI = (100,000 × 0.01 × 1.1268) / (1.1268 - 1)
    = 1126.8 / 0.1268
    ≈ 8,888.88 ZMW per month
```

### Implementation Checklist

- [ ] Implement `calculateEMI` function in `packages/shared/src/index.ts`
- [ ] Create Zod schema for input validation
- [ ] Write unit tests covering at least 3 scenarios:
  - [ ] Benchmark case (100k, 12%, 12 months)
  - [ ] Edge case (very low rate, 0.1%)
  - [ ] Edge case (long tenure, 360 months)
- [ ] Export types for frontend consumption
- [ ] Verify tests pass: `pnpm test`

---

## 🧪 Testing & Verification

### Running Tests Locally

```bash
# Unit tests (Vitest)
pnpm test                    # Run once
pnpm test:watch              # Watch mode (re-run on file changes)
pnpm test:coverage           # Generate coverage report

# E2E tests (Playwright)
pnpm e2e                     # Run Playwright tests
pnpm e2e:ui                  # Interactive UI mode

# All tests at once
pnpm test && pnpm e2e
```

### Coverage Report

After running `pnpm test:coverage`, open `coverage/index.html` in your browser to see:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

**Target: ≥80% statement coverage**

### Debugging Tests

```bash
# Debug Vitest
pnpm test --reporter=verbose

# Debug Playwright
pnpm e2e:debug

# VS Code debugger
# Add breakpoint, then run in debug mode
```

---

## 📦 Common Commands

### Development

```bash
pnpm dev                     # Start dev server (http://localhost:5173)
pnpm build                   # Build all packages
pnpm preview                 # Preview production build
```

### Testing

```bash
pnpm test                    # Run all unit tests
pnpm test:watch              # Watch mode
pnpm test:coverage           # Coverage report
pnpm e2e                     # Run E2E tests
```

### Code Quality

```bash
pnpm lint                    # Run ESLint
pnpm format                  # Auto-format code
pnpm typecheck               # Run TypeScript compiler
pnpm audit                   # Security audit
```

### Maintenance

```bash
pnpm install                 # Install/update dependencies
pnpm update                  # Update packages
pnpm clean                   # Remove build artifacts
```

---

## 🔍 Troubleshooting

### Issue: Pre-commit hook fails

**Symptom**: Can't commit code

**Solution**:
```bash
# Check what's failing
pnpm lint

# Auto-fix linting issues
pnpm lint --fix

# Auto-format code
pnpm format

# Try committing again
git commit -m "your message"
```

### Issue: TypeScript errors in IDE

**Symptom**: IDE shows type errors, but `pnpm typecheck` passes

**Solution**:
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Issue: Tests failing after upgrading dependencies

**Symptom**: `pnpm test` fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .pnpm-store
pnpm install

# Run tests again
pnpm test
```

### Issue: Port 5173 already in use

**Symptom**: `pnpm dev` fails with port error

**Solution**:
```bash
# Kill the process using the port (Linux/macOS)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill

# Or specify a different port
pnpm dev -- --port 5174
```

---

## 🤝 Contributing

### Commit Message Convention

We follow **Semantic Commit Messages**:

```
type(scope): subject

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance

**Examples:**
```
feat(calculator): improve EMI formula precision
fix(validation): handle edge case for 0% interest rate
docs(readme): update quick start instructions
test(emi): add benchmark test cases
```

### Pull Request Checklist

Before creating a PR, ensure:

- [ ] Code passes `pnpm lint`
- [ ] Code passes `pnpm typecheck`
- [ ] All tests pass: `pnpm test`
- [ ] E2E tests pass: `pnpm e2e`
- [ ] Coverage ≥80%: `pnpm test:coverage`
- [ ] Commit messages follow convention
- [ ] PR description explains the changes
- [ ] Related issue is linked

### Code Review Standards

**Reviewers will check:**
- ✅ Type safety (no `any`)
- ✅ Test coverage (≥80%)
- ✅ Performance (no unnecessary re-renders)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Security (no vulnerabilities)
- ✅ Documentation (clear comments)

---

## 📚 Additional Resources

### Documentation

- **[TECHNICAL_DESIGN_DOCUMENT.md](./docs/TECHNICAL_DESIGN_DOCUMENT.md)** - Architecture and design decisions
- **[IMPLEMENTATION_COMPLETE.md](./docs/IMPLEMENTATION_COMPLETE.md)** - Project delivery checklist

### External Links

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Testing](https://playwright.dev/)

### Getting Help

- **Questions?** Ask the team on Slack or Discord
- **Found a bug?** Create a GitHub Issue
- **Have an idea?** Open a Discussion

---

## 🎓 Learning Path

### For New Developers

1. **Day 1**: Read this README + clone the repo
2. **Day 2**: Run `pnpm dev` and explore the codebase
3. **Day 3**: Implement your first test in `packages/shared/__tests__/`
4. **Day 4**: Create a small UI feature in `apps/web`
5. **Day 5**: Submit a PR and get code review feedback

### For Experienced Developers

- Review the [Technical Design Document](./docs/TECHNICAL_DESIGN_DOCUMENT.md)
- Explore the Turborepo configuration in `turbo.json`
- Check out existing ADRs in `docs/adr/`
- Contribute to performance optimizations

---

## 📊 Project Health

| Metric | Target | Status |
| --- | --- | --- |
| **Test Coverage** | ≥80% | ✅ Enforced |
| **Type Coverage** | 100% | ✅ Strict mode |
| **Linting** | Zero violations | ✅ Pre-commit |
| **Build Time** | <30s | ✅ Turbo cached |
| **CI Pass Rate** | 100% | ✅ Zero regressions |

---

## 🚀 Next Steps

1. **Clone the repo**: `git clone https://github.com/Mweenda/Loan-EMI-Calculator.git`
2. **Switch to develop**: `git checkout develop`
3. **Install**: `pnpm install`
4. **Start**: `pnpm dev`
5. **Read the TDD**: Open `docs/TECHNICAL_DESIGN_DOCUMENT.md`
6. **Make your first commit**: Create a feature branch and commit something

---

## 💡 Philosophy

> **"Production-ready from day one."** This monorepo enforces the highest standards for type safety, testing, and code quality. We believe that automation and clear standards make developers *faster*, not slower. The pre-commit hooks, linting, and testing aren't obstacles—they're guardrails that let you code with confidence.

---

## 📝 License

MIT © [Mweenda](https://github.com/Mweenda)

---

**Last Updated**: January 20, 2026  
**Maintained By**: Engineering Team  
**Questions?** Contact the Senior Developer

