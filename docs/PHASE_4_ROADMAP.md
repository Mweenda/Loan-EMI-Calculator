# 📋 PHASE 4 ROADMAP: Reliability & Quality Gate

**Version**: 1.0  
**Date**: January 20, 2026  
**Owner**: Senior Engineering Team  
**Status**: QUEUED (Starts after Phase 3 complete)  
**Estimated Duration**: 1-2 days

---

## 🎯 Phase Goal

Ensure zero-regression, automated deployment, and production-ready quality through comprehensive E2E testing, pre-commit automation, and CI/CD enforcement.

---

## 📋 Features Overview

| Feature | Objective | Duration |
| --- | --- | --- |
| **4.1** | Playwright E2E Tests | 1 day |
| **4.2** | Husky Pre-commit Hooks | 0.5 days |
| **4.3** | GitHub Actions CI/CD | 0.5 days |

---

## 🎭 Feature 4.1: Playwright E2E Tests

### Objective
Create comprehensive end-to-end tests covering the full user journey from landing to result display.

### Requirements
- ✅ Test happy path: Fill form → Calculate → See result
- ✅ Test error scenarios: Invalid inputs → Error messages
- ✅ Test accessibility: Keyboard navigation, screen reader
- ✅ Test edge cases: Min/max values, boundary conditions
- ✅ Test responsiveness: Mobile, tablet, desktop
- ✅ 100% test pass rate

### Test Cases

```typescript
// apps/web/tests/calculator.e2e.spec.ts
describe('Calculator E2E', () => {
  // HAPPY PATH
  test('should calculate EMI successfully', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="principal"]', '100000');
    await page.fill('input[name="annualRate"]', '12');
    await page.fill('input[name="tenureMonths"]', '12');
    await page.click('button[type="submit"]');
    await page.waitForText('8,884.88');
    expect(page.locator('text=8,884.88')).toBeVisible();
  });

  // ERROR SCENARIOS
  test('should show error for negative principal', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="principal"]', '-1000');
    await page.click('button[type="submit"]');
    await page.waitForText('Principal must be');
    expect(page.locator('text=Principal must be')).toBeVisible();
  });

  // ACCESSIBILITY
  test('should be navigable with keyboard only', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab'); // Focus principal
    await page.keyboard.type('100000');
    await page.keyboard.press('Tab'); // Focus rate
    await page.keyboard.type('12');
    await page.keyboard.press('Tab'); // Focus tenure
    await page.keyboard.type('12');
    await page.keyboard.press('Tab'); // Focus button
    await page.keyboard.press('Enter');
    await page.waitForText('8,884.88');
  });

  // EDGE CASES
  test('should handle 0% interest rate', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[name="principal"]', '100000');
    await page.fill('input[name="annualRate"]', '0');
    await page.fill('input[name="tenureMonths"]', '12');
    await page.click('button[type="submit"]');
    await page.waitForText('8,333.33');
  });
});
```

### Acceptance Criteria
- [ ] AC4.1.1: Happy path test passes
- [ ] AC4.1.2: Error scenario tests pass
- [ ] AC4.1.3: Accessibility tests pass (keyboard nav)
- [ ] AC4.1.4: Edge case tests pass
- [ ] AC4.1.5: Mobile responsiveness verified
- [ ] AC4.1.6: 100% test pass rate
- [ ] AC4.1.7: All critical user journeys covered

---

## 🪝 Feature 4.2: Husky Pre-commit Hooks

### Objective
Automate code quality checks before commits to prevent unsafe code from entering repository.

### Requirements
- ✅ Pre-commit hook runs on every commit
- ✅ Blocks commit if TypeScript errors exist
- ✅ Blocks commit if ESLint violations exist
- ✅ Auto-fixes formatting issues
- ✅ Runs unit tests on changed files
- ✅ Clear error messages if checks fail

### Hook Execution

```bash
# What runs before commit:
pnpm exec lint-staged

# Which runs:
1. TypeScript check (pnpm typecheck)
2. ESLint with auto-fix (pnpm lint -- --fix)
3. Prettier formatting (pnpm format)
4. Unit tests on changed files (pnpm test -- changed-files)
```

### Acceptance Criteria
- [ ] AC4.2.1: Pre-commit hook installed and active
- [ ] AC4.2.2: Blocks commit on TypeScript errors
- [ ] AC4.2.3: Blocks commit on ESLint violations
- [ ] AC4.2.4: Auto-fixes formatting
- [ ] AC4.2.5: Runs tests on changed files
- [ ] AC4.2.6: Shows helpful error messages
- [ ] AC4.2.7: Can be bypassed only with --no-verify (documented)

---

## 🤖 Feature 4.3: GitHub Actions CI/CD

### Objective
Automate testing, linting, and deployment on every push to ensure zero-regression policy.

### Requirements
- ✅ Run all tests on every push
- ✅ Check code coverage (≥80%)
- ✅ Run TypeScript type-check
- ✅ Run ESLint linting
- ✅ Security audit via `pnpm audit`
- ✅ Block merge if any check fails
- ✅ Weekly dependency audit

### Workflow Triggers

```yaml
# On every push to any branch
on: [push]

# Run:
1. Install dependencies
2. Run full test suite (pnpm test)
3. Check coverage (≥80%)
4. TypeScript check
5. ESLint check
6. Security audit
7. Build verification

# If all pass: ✅ Merge allowed
# If any fail: 🚫 Merge blocked
```

### Weekly Audit

```yaml
# Every Monday at 9am UTC
schedule:
  - cron: '0 9 * * 1'

# Run: pnpm audit
# Report vulnerabilities
# Alert if critical found
```

### Acceptance Criteria
- [ ] AC4.3.1: Workflow runs on every push
- [ ] AC4.3.2: All tests executed
- [ ] AC4.3.3: Coverage verified (≥80%)
- [ ] AC4.3.4: TypeScript check passes
- [ ] AC4.3.5: ESLint check passes
- [ ] AC4.3.6: Security audit passes
- [ ] AC4.3.7: Merge blocked if checks fail
- [ ] AC4.3.8: Weekly audit scheduled

---

## ✅ Phase 4 Global Acceptance Criteria

| AC | Requirement | Status |
| --- | --- | --- |
| **AC4.0.1** | All E2E tests passing | ⏳ Pending |
| **AC4.0.2** | Pre-commit hooks active | ⏳ Pending |
| **AC4.0.3** | GitHub Actions configured | ⏳ Pending |
| **AC4.0.4** | 100% merge checks pass | ⏳ Pending |
| **AC4.0.5** | Security audit: 0 vulns | ⏳ Pending |
| **AC4.0.6** | Overall coverage ≥90% | ⏳ Pending |
| **AC4.0.7** | Zero regressions detected | ⏳ Pending |

---

## 📊 Phase 4 Success Metrics

- **E2E Test Pass Rate**: 100%
- **Overall Coverage**: ≥90%
- **Security Vulnerabilities**: 0 (critical + high)
- **Deployment Success**: 100%
- **Merge Blocking Accuracy**: 0 false positives
- **Build Time**: <10 minutes

---

## 🗓️ Phase 4 Timeline

| Day | Focus | Deliverable |
| --- | --- | --- |
| **Day 1** | Features 4.1, 4.2, 4.3 | All ready for review |
| **Day 2** | Code review + refinements | All merged to main |

---

## ✨ Phase 4 Final Sign-Off

**MVP Completion Checklist**:
- [x] Phase 1 ✅ (Core Engine)
- [x] Phase 2 ✅ (Professional UI)
- [x] Phase 3 ✅ (Persistence & API)
- [x] Phase 4 ✅ (Reliability & QA)

**Final Verification**:
- ✅ All tests passing (unit + E2E)
- ✅ Coverage ≥90%
- ✅ Zero regressions
- ✅ Security audit clean
- ✅ Accessibility verified
- ✅ Performance benchmarks met
- ✅ Code review approved

**Final Approval**: Senior dev + Product owner → **PRODUCTION READY**

---

## 🚀 Deployment

### To Production
```bash
# Merge develop → main
# GitHub Actions automatically:
# 1. Runs all tests
# 2. Builds application
# 3. Deploys to production
# 4. Monitors for errors
```

### Post-Deployment
- ✅ Monitor error rates
- ✅ Check performance metrics
- ✅ Gather user feedback
- ✅ Plan Phase 2 features (UI enhancements)

---

## 🎓 Phase 4: The Journey Ends, Legacy Begins

By completing Phase 4, the team will have:
- ✅ Built a production-grade financial tool
- ✅ Learned professional software engineering practices
- ✅ Established code quality discipline
- ✅ Created sustainable architecture
- ✅ Documented all decisions
- ✅ Built team collaboration patterns

**This MVP becomes the foundation for all future work.**

---

