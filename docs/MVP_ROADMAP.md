# 📋 STRATEGIC MVP ROADMAP - Loan EMI Calculator

**Version**: 1.0  
**Date**: January 20, 2026  
**Owner**: Senior Engineering Team  
**Status**: ACTIVE - Team Authorization APPROVED

---

## 🎯 Executive Summary

This **Strategic MVP Roadmap** defines the production-grade development path for the Loan EMI Calculator. The roadmap is structured into **4 Critical Phases**, each with specific deliverables, acceptance criteria, and accountability checkpoints.

**Key Principle**: Build a production-grade financial tool, not just a calculator.

---

## 📊 Roadmap Overview

| Phase | Goal | Duration | Status |
| --- | --- | --- | --- |
| **Phase 1** | Core Calculation Engine | 2-3 days | 🔄 ACTIVE |
| **Phase 2** | Professional UI & UX | 3-4 days | ⏳ QUEUED |
| **Phase 3** | Persistence & API Layer | 2-3 days | ⏳ QUEUED |
| **Phase 4** | Reliability & QA | 1-2 days | ⏳ QUEUED |
| **Total** | Complete MVP | ~10-12 days | 🎯 On Track |

---

## 🏃 PHASE 1: Core Calculation Engine & Validation

### Phase Goal
Establish the mathematical "Source of Truth" for EMI calculations with comprehensive validation and test coverage.

### Phase Duration
**2-3 days** (Estimated)

### Features

#### Feature 1.1: EMI Formula Implementation
**Objective**: Implement the mathematical formula in `@loan-calc/shared`

**Requirements**:
- ✅ Implement the standard EMI formula: $\text{EMI} = \frac{P \times R \times (1+R)^N}{(1+R)^N - 1}$
- ✅ Use `Math.pow()` for exponential calculations
- ✅ Handle all numeric types correctly (integers and decimals)
- ✅ Export typed function: `calculateEMI(data: LoanInput): number`

**Location**: `packages/shared/src/index.ts`

**Code Template**:
```typescript
export const calculateEMI = (data: LoanInput): number => {
  const { principal, annualRate, tenureMonths } = data;
  const r = annualRate / (12 * 100); // Monthly interest rate
  const power = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * power) / (power - 1);
  return emi;
};
```

**Acceptance Criteria** (AC):
- [ ] AC1.1.1: Function accepts LoanInput type (principal, annualRate, tenureMonths)
- [ ] AC1.1.2: Returns number type (EMI result)
- [ ] AC1.1.3: Handles all numeric edge cases (decimals, large numbers, small numbers)
- [ ] AC1.1.4: No TypeScript errors (`pnpm typecheck` passes)
- [ ] AC1.1.5: Code formatted per Prettier (`pnpm format` passes)
- [ ] AC1.1.6: No ESLint violations (`pnpm lint` passes)

**Deliverables**:
- [ ] `packages/shared/src/index.ts` with `calculateEMI` function
- [ ] Type definition exported: `export type LoanInput`
- [ ] All AC tests pass

---

#### Feature 1.2: Zod Validation Schema
**Objective**: Create comprehensive input validation with Zod

**Requirements**:
- ✅ Create `LoanInputSchema` with Zod
- ✅ Validate principal (positive number, reasonable limits)
- ✅ Validate annual rate (0.1% to 100% range)
- ✅ Validate tenure (1 to 360 months)
- ✅ Provide clear error messages for invalid inputs
- ✅ Support string-to-number coercion for form inputs

**Code Template**:
```typescript
export const LoanInputSchema = z.object({
  principal: z.number()
    .positive("Principal must be greater than 0")
    .max(10000000, "Principal cannot exceed 10,000,000"),
  annualRate: z.number()
    .min(0.1, "Rate must be at least 0.1%")
    .max(100, "Rate cannot exceed 100%"),
  tenureMonths: z.number()
    .int("Tenure must be a whole number")
    .min(1, "Tenure must be at least 1 month")
    .max(360, "Tenure cannot exceed 360 months"),
});

export type LoanInput = z.infer<typeof LoanInputSchema>;
```

**Acceptance Criteria**:
- [ ] AC1.2.1: Schema validates valid inputs
- [ ] AC1.2.2: Schema rejects negative principal
- [ ] AC1.2.3: Schema rejects interest rate > 100%
- [ ] AC1.2.4: Schema rejects tenure > 360 months
- [ ] AC1.2.5: Error messages are user-friendly
- [ ] AC1.2.6: Type `LoanInput` is properly exported

**Deliverables**:
- [ ] `LoanInputSchema` in `packages/shared/src/index.ts`
- [ ] Type `LoanInput` exported
- [ ] All validations working correctly

---

#### Feature 1.3: Unit Test Suite (Vitest)
**Objective**: Achieve ≥80% coverage on core calculation logic

**Requirements**:
- ✅ Write unit tests for `calculateEMI` function
- ✅ Test at least 5 benchmark cases
- ✅ Test edge cases (zero interest, min/max values)
- ✅ Test validation errors
- ✅ Achieve ≥80% code coverage
- ✅ All tests passing

**Test Cases to Include**:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateEMI, LoanInputSchema } from '../index';

describe('EMI Calculator - Phase 1', () => {
  // BENCHMARK CASES
  it('Case 1: Standard 100k at 12% for 12 months', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8884.88, 2);
  });

  it('Case 2: Large loan 500k at 10% for 60 months', () => {
    const result = calculateEMI({
      principal: 500000,
      annualRate: 10,
      tenureMonths: 60,
    });
    expect(result).toBeCloseTo(10606.06, 2);
  });

  it('Case 3: Short tenure 50k at 2% for 24 months', () => {
    const result = calculateEMI({
      principal: 50000,
      annualRate: 2,
      tenureMonths: 24,
    });
    expect(result).toBeCloseTo(2097.15, 2);
  });

  // EDGE CASES
  it('Edge Case 1: 0% interest rate (should equal principal / tenure)', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 0,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8333.33, 2);
  });

  it('Edge Case 2: 1-month tenure', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 1,
    });
    expect(result).toBeGreaterThan(100000); // Must include interest
  });

  it('Edge Case 3: Maximum tenure (360 months = 30 years)', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 5,
      tenureMonths: 360,
    });
    expect(result).toBeLessThan(100000); // EMI should be reasonable
  });

  // VALIDATION TESTS
  it('Validation: Rejects negative principal', () => {
    expect(() => {
      LoanInputSchema.parse({
        principal: -100000,
        annualRate: 12,
        tenureMonths: 12,
      });
    }).toThrow();
  });

  it('Validation: Rejects interest rate > 100%', () => {
    expect(() => {
      LoanInputSchema.parse({
        principal: 100000,
        annualRate: 150,
        tenureMonths: 12,
      });
    }).toThrow();
  });

  it('Validation: Rejects tenure > 360 months', () => {
    expect(() => {
      LoanInputSchema.parse({
        principal: 100000,
        annualRate: 12,
        tenureMonths: 361,
      });
    }).toThrow();
  });
});
```

**Acceptance Criteria**:
- [ ] AC1.3.1: All benchmark test cases pass
- [ ] AC1.3.2: All edge case tests pass
- [ ] AC1.3.3: All validation tests pass
- [ ] AC1.3.4: Code coverage ≥80%
- [ ] AC1.3.5: `pnpm test:coverage` shows passing results
- [ ] AC1.3.6: No skipped tests

**Deliverables**:
- [ ] `packages/shared/src/__tests__/index.test.ts` with comprehensive tests
- [ ] Coverage report showing ≥80%
- [ ] All tests green in CI/CD

---

### Phase 1 Acceptance Criteria (Global)

| AC | Requirement | Status |
| --- | --- | --- |
| **AC1.0.1** | All feature branches merged to develop | ⏳ Pending |
| **AC1.0.2** | Zero TypeScript errors (`pnpm typecheck`) | ⏳ Pending |
| **AC1.0.3** | Zero ESLint violations (`pnpm lint`) | ⏳ Pending |
| **AC1.0.4** | ≥80% test coverage achieved | ⏳ Pending |
| **AC1.0.5** | All tests passing (`pnpm test`) | ⏳ Pending |
| **AC1.0.6** | Code review approved (2 reviewers) | ⏳ Pending |
| **AC1.0.7** | ADRs documented for all decisions | ⏳ Pending |
| **AC1.0.8** | No regressions from previous commit | ⏳ Pending |

---

### Phase 1 Accountability Requirements

For **EVERY** feature, the team must provide:

#### 1. **The Code** ✅
- Written in strict TypeScript (no implicit `any`)
- Follows code style (ESLint + Prettier pass)
- Uses proper type definitions
- Exports types for downstream consumers

#### 2. **The Test** ✅
- Unit tests for all functions
- Edge case coverage
- Validation error scenarios
- Coverage report (≥80%)

#### 3. **The ADR** ✅
**Architecture Decision Record** explaining:
- Why this implementation was chosen
- Trade-offs considered
- Future implications

**Example ADR for Phase 1**:
```markdown
# ADR-001: Use Math.pow for EMI Calculation

## Context
We needed to calculate compound interest for EMI formula: (1+R)^N

## Decision
Use Math.pow(1 + r, tenureMonths) instead of a loop or other method.

## Rationale
- Math.pow is optimized in JavaScript engines
- More readable and maintainable
- Consistent with industry standards
- No performance concerns for our use case

## Consequences
- Will need to handle edge cases (negative exponents) if requirements change
- Future: Could optimize with memoization if needed
```

---

## 🚀 PHASE 2: Professional UI & Interaction

### Phase Goal
Deliver a pixel-perfect, accessible, and responsive user interface.

### Phase Duration
**3-4 days** (Estimated)

### Features

#### Feature 2.1: React Hook Form Integration
- Interactive form with validation
- Real-time error feedback
- Zod resolver integration
- Form state management

#### Feature 2.2: Real-time Feedback & Error States
- Clear error messages
- Loading states
- Success feedback
- Input constraints

#### Feature 2.3: Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop experience
- Accessibility features

#### Feature 2.4: WCAG 2.1 AA Compliance
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

---

## 💾 PHASE 3: Persistence & API Layer

### Phase Goal
Enable data persistence and future scalability.

### Features

#### Feature 3.1: tRPC Integration
- Create calculation logging procedure
- Type-safe API layer
- Error handling

#### Feature 3.2: Firestore Seeding
- Default loan types
- Backend integration demo
- Data persistence

#### Feature 3.3: Loading & Error States
- Graceful API failures
- User feedback
- Retry mechanisms

---

## ✅ PHASE 4: Reliability & Quality Gate

### Phase Goal
Ensure zero-regression and automated deployment.

### Features

#### Feature 4.1: Playwright E2E Tests
- Full user journey
- Happy path testing
- Error scenario testing
- Accessibility verification

#### Feature 4.2: Husky Pre-commit Hooks
- Lint on commit
- Format on commit
- Type-check on commit
- Prevent unsafe commits

#### Feature 4.3: GitHub Actions CI/CD
- Run all tests on push
- Security audit weekly
- Block on test failure
- Auto-deploy on main merge

---

## 📈 Success Metrics Framework

### Code Quality Metrics
- **Coverage**: ≥80% statement coverage
- **TypeScript**: 0 type errors
- **Linting**: 0 violations
- **Tests**: 100% pass rate

### Team Metrics
- **Code Review Time**: <24 hours
- **PR Merge Time**: <2 days
- **Standup Attendance**: 100%
- **Blocker Resolution**: <4 hours

### Business Metrics
- **On-Time Delivery**: All phases on schedule
- **Zero Regressions**: No bugs in production
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: <100ms calculation time

---

## 📋 Team Authorization

**This is your green light to begin Phase 1.**

Starting immediately:
1. Create feature branches for each Feature (1.1, 1.2, 1.3)
2. Implement with strict TDD (test-first approach)
3. Submit PRs with code, tests, and ADRs
4. Code review checkpoint before merge
5. All features merged to develop by EOD (day 3)

---

## 📞 Communication & Escalation

### Daily Standup
- 15-min sync on progress
- Blockers flagged immediately
- PRs ready for review posted

### Code Review Checkpoint
- Submit PR with: Code + Tests + ADR
- 2-reviewer approval required
- Feedback within 24 hours

### Escalation
- Blocker → Flag in standup
- Architecture question → Senior dev
- Resource issue → Project manager

---

## ✨ What Success Looks Like

By end of Phase 1:
- ✅ `@loan-calc/shared` is production-ready
- ✅ All calculations accurate to 2 decimal places
- ✅ ≥80% test coverage
- ✅ Zero TypeScript errors
- ✅ All edge cases handled
- ✅ Team understands codebase

---

**Next Step**: Team begins Phase 1 implementation immediately.

Estimated Phase 1 Completion: January 22-23, 2026

