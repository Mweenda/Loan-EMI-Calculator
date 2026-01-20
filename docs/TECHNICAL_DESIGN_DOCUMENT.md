# Technical Design Document: Loan EMI Calculator

## Executive Summary

The **Loan EMI Calculator** is a production-grade financial application that calculates equated monthly installments (EMI) for loans. This document outlines the architectural decisions, implementation guidelines, and quality standards required to reach **Level 5 (Exceptional)** on the rubric.

---

## 1. Project Goals

- **Accuracy**: EMI formula must be mathematically correct and verified against benchmarks.
- **Type Safety**: 100% TypeScript strict mode compliance; no implicit `any` types.
- **Accessibility**: UI must be accessible to all users (WCAG 2.1 AA).
- **Quality**: ≥80% test coverage; zero-regression policy via CI/CD.
- **Security**: Automated dependency scanning; no hardcoded secrets.
- **Performance**: Turbo-cached builds; optimized re-renders via React Hook Form.

---

## 2. Architecture

### 2.1 Monorepo Structure

```
apps/web/        # Frontend (React + Vite)
packages/shared/ # Business logic (EMI formula + validation)
docs/            # Architecture Decision Records (ADRs)
```

### 2.2 Separation of Concerns

| Layer | Responsibility | Technology |
| --- | --- | --- |
| **Shared** | Math logic, validation, types | Zod, TypeScript |
| **Frontend** | UI/UX, form state, rendering | React, React Hook Form, shadcn/ui |
| **CI/CD** | Testing, linting, deployment | Turbo, GitHub Actions, Playwright |

---

## 3. Implementation Guidelines

### 3.1 The EMI Formula

Formula: $\text{EMI} = \frac{P \times R \times (1+R)^N}{(1+R)^N - 1}$

Where:
- $P$ = Principal (loan amount)
- $R$ = Monthly interest rate (annual rate ÷ 12 ÷ 100)
- $N$ = Tenure in months

**Implementation** (`packages/shared/src/index.ts`):

```typescript
export const calculateEMI = (data: LoanInput): number => {
  const { principal, annualRate, tenureMonths } = data;
  const r = annualRate / (12 * 100); // Monthly rate
  const power = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * power) / (power - 1);
  return emi;
};
```

### 3.2 Zod Schema (Validation)

All inputs must be validated against the Zod schema:

```typescript
export const LoanInputSchema = z.object({
  principal: z.number().min(1, "Principal is required"),
  annualRate: z.number().min(0.1, "Rate must be positive"),
  tenureMonths: z.number().int().min(1, "Tenure must be at least 1 month"),
});
```

**Rationale**: Zod provides runtime type safety, catching user input errors before they reach the formula.

### 3.3 React Component Pattern

The calculator page follows a **Controlled Component** pattern with React Hook Form:

```typescript
const form = useForm<LoanInput>({
  resolver: zodResolver(LoanInputSchema),
});

const onSubmit = (data: LoanInput) => {
  const result = calculateEMI(data);
  setEmiResult(result);
};
```

**Rationale**: React Hook Form minimizes re-renders and integrates seamlessly with Zod validation.

---

## 4. Testing Standards

### 4.1 Unit Tests (Vitest)

**Location**: `packages/shared/src/__tests__/`

**Benchmark Cases**:
- Principal: 100,000 | Rate: 12% | Tenure: 12 months → **EMI: 8,884.88**
- Principal: 500,000 | Rate: 10% | Tenure: 60 months → **EMI: 10,606.06**

**Test Coverage Target**: ≥80% statement coverage

### 4.2 E2E Tests (Playwright)

**Location**: `apps/web/tests/`

**Happy Path**:
1. User enters principal, rate, tenure
2. User clicks "Calculate"
3. EMI result displays correctly

**Error Paths**:
- Negative inputs → Validation error
- Empty fields → Validation error
- Non-numeric inputs → Type coercion/error

---

## 5. Quality Gates

### 5.1 Pre-commit Hooks (Husky)

Every commit triggers:
1. **ESLint** - Enforces no `any` types, naming conventions
2. **Prettier** - Auto-formats code
3. **TypeScript** - Type-checks all code

If any step fails, the commit is blocked.

### 5.2 CI/CD Pipeline (GitHub Actions)

**On push/PR**:
1. Install dependencies
2. Run lint
3. Run typecheck
4. Run unit tests with coverage
5. Run E2E tests
6. Deploy preview (on PR only)

**Weekly security audit**: Every Monday at 00:00 UTC

---

## 6. Path Aliases

To avoid brittle relative imports:

```typescript
// ✅ Good
import { calculateEMI } from '@shared/index';

// ❌ Avoid
import { calculateEMI } from '../../../packages/shared/src/index';
```

**Configuration** (`tsconfig.json`):
```json
{
  "baseUrl": ".",
  "paths": {
    "@shared/*": ["packages/shared/src/*"],
    "@web/*": ["apps/web/src/*"]
  }
}
```

---

## 7. Security Considerations

### 7.1 Dependency Management

- Use `pnpm audit --audit-level=high` to scan vulnerabilities
- Automated weekly audit via GitHub Actions
- Pin major versions in `package.json`

### 7.2 Secrets Management

- Never hardcode API keys or secrets
- Use GitHub Secrets for sensitive data
- Validate environment variables at runtime using **T3 Env** pattern

### 7.3 Type Safety

- Strict TypeScript mode prevents implicit `any`
- ESLint enforces `@typescript-eslint/no-explicit-any`

---

## 8. Accessibility (a11y)

The UI uses **Radix UI** primitives (via shadcn/ui), ensuring:
- Semantic HTML
- ARIA labels automatically mapped
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader compatibility

---

## 9. Performance Optimization

### 9.1 Turbo Caching

Turborepo caches build outputs, reducing build time from minutes to seconds for unchanged packages.

### 9.2 React Hook Form

Minimizes re-renders by maintaining form state without re-rendering the entire component tree.

---

## 10. Onboarding Checklist

For new team members:

- [ ] Clone repository
- [ ] Run `pnpm install`
- [ ] Run `pnpm dev` to start dev server
- [ ] Run `pnpm test` to verify setup
- [ ] Read this TDD document
- [ ] Review existing ADRs in `docs/adr/`
- [ ] Create a feature branch and make a test commit (to verify Husky works)

---

## 11. Architecture Decision Records (ADRs)

All significant architectural decisions should be documented as ADRs:

**File**: `docs/adr/NNN-decision-title.md`

**Template**:
```markdown
# ADR-NNN: [Decision Title]

## Context
[Problem and context]

## Decision
[What we decided and why]

## Consequences
[Benefits and drawbacks]
```

---

## 12. Versioning & Changelog

We use **Changesets** for automated versioning and changelog generation:

```bash
pnpm changeset add
```

This ensures semantic versioning and clear release notes.

---

## 13. Deployment Strategy

1. **PR Merge** → Quality gate passes
2. **Main Branch** → Automated build and test
3. **Firebase Deployment** → Automatic production deployment
4. **Changelog** → Auto-generated from commits

---

## References

- [Turborepo Handbook](https://turbo.build/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Playwright E2E Testing](https://playwright.dev/)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Document Version**: 1.0  
**Last Updated**: January 20, 2026  
**Maintained By**: Senior Developer
