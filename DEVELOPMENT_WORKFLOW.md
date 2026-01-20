# 📋 Development Workflow Guide

> This guide outlines the complete development workflow for the Loan EMI Calculator project, from task assignment to production deployment.

---

## 🎯 Project Overview

| Component | Tech Stack | Owner |
| --- | --- | --- |
| **Shared Logic** | TypeScript + Zod + Vitest | Backend/Math Team |
| **Frontend** | React + Vite + shadcn/ui | Frontend Team |
| **E2E Tests** | Playwright | QA/Frontend Team |
| **CI/CD** | GitHub Actions + Turborepo | DevOps/All |

---

## 📊 Development Phases

### Phase 1: Task 1 - EMI Formula Implementation

**Objective**: Implement the core EMI calculation logic with full test coverage.

**Timeline**: 2-3 days

**Tasks**:
1. [ ] Implement `calculateEMI()` function in `packages/shared/src/index.ts`
2. [ ] Create Zod validation schema for `LoanInput`
3. [ ] Write unit tests (≥80% coverage)
4. [ ] Verify calculations against benchmark values
5. [ ] Create PR to `develop` branch
6. [ ] Get code review approval
7. [ ] Merge to `develop`

**Acceptance Criteria**:
- ✅ All unit tests pass
- ✅ Coverage ≥80%
- ✅ No TypeScript errors
- ✅ ESLint passes
- ✅ Formula verified against 3+ test cases

**Example Benchmark Tests**:
```typescript
// Test case 1: Standard loan
principal: 100,000 | rate: 12% | tenure: 12 months
Expected EMI: 8,884.88

// Test case 2: Long tenure
principal: 500,000 | rate: 10% | tenure: 60 months
Expected EMI: 10,606.06

// Test case 3: Low interest rate
principal: 50,000 | rate: 2% | tenure: 24 months
Expected EMI: 2,097.15
```

---

### Phase 2: Frontend Implementation

**Objective**: Build the calculator UI with form validation and result display.

**Timeline**: 3-4 days

**Tasks**:
1. [ ] Create `Calculator.tsx` component in `apps/web/src/pages/`
2. [ ] Implement React Hook Form integration
3. [ ] Add Zod validation resolver
4. [ ] Import `calculateEMI` from `@shared`
5. [ ] Build form fields for principal, rate, tenure
6. [ ] Display formatted EMI result
7. [ ] Add error handling
8. [ ] Implement responsive design with Tailwind
9. [ ] Write component tests
10. [ ] Create PR to `develop` branch

**Acceptance Criteria**:
- ✅ Form validates input correctly
- ✅ EMI result displays with proper formatting
- ✅ Responsive on mobile/tablet/desktop
- ✅ Accessible (WCAG 2.1 AA)
- ✅ No TypeScript errors
- ✅ Tests pass (unit + visual regression)

**UI Elements Required**:
- [ ] Title: "Loan EMI Calculator"
- [ ] Input fields: Principal, Annual Rate (%), Tenure (months)
- [ ] Submit button: "Calculate"
- [ ] Result card: Displays EMI in currency format
- [ ] Error messages: Inline validation feedback

---

### Phase 3: End-to-End Testing

**Objective**: Verify complete user flow with Playwright tests.

**Timeline**: 1-2 days

**Tasks**:
1. [ ] Create E2E test file: `apps/web/tests/calculator.e2e.spec.ts`
2. [ ] Test happy path: Form submission → Result display
3. [ ] Test validation: Negative/empty inputs → Error messages
4. [ ] Test edge cases: Extreme values (0%, very long tenure)
5. [ ] Test accessibility: Keyboard navigation, screen reader
6. [ ] Create PR to `develop` branch

**Acceptance Criteria**:
- ✅ Happy path test passes
- ✅ Error scenario tests pass
- ✅ Edge case tests pass
- ✅ Accessibility tests pass
- ✅ Tests are maintainable and documented

**Example Tests to Include**:
```typescript
test('calculates EMI for standard input', async ({ page }) => {
  // Enter values → Submit → Verify result
});

test('shows validation error for negative principal', async ({ page }) => {
  // Enter negative value → Verify error message
});

test('keyboard navigation works', async ({ page }) => {
  // Tab through form → Fill fields → Submit with Enter
});
```

---

### Phase 4: Quality Assurance & Review

**Objective**: Ensure all code meets Level 5 standards before merging to main.

**Timeline**: 1-2 days

**Tasks**:
1. [ ] Run all tests: `pnpm test && pnpm e2e`
2. [ ] Verify coverage: `pnpm test:coverage` (≥80%)
3. [ ] Run linting: `pnpm lint` (zero violations)
4. [ ] TypeScript check: `pnpm typecheck` (no errors)
5. [ ] Security audit: `pnpm audit` (no high vulnerabilities)
6. [ ] Code review: 1-2 peer reviews
7. [ ] User acceptance: Manual testing by senior dev
8. [ ] Performance review: Check build time, bundle size
9. [ ] Documentation: README, TECHNICAL_DESIGN_DOCUMENT updated

**Acceptance Criteria**:
- ✅ All tests pass
- ✅ Coverage ≥80%
- ✅ No linting violations
- ✅ No TypeScript errors
- ✅ No security vulnerabilities
- ✅ Code review approved
- ✅ Performance acceptable
- ✅ Documentation complete

---

### Phase 5: Deployment

**Objective**: Merge to main and deploy to production.

**Timeline**: 1 day

**Tasks**:
1. [ ] Create PR from `develop` to `main`
2. [ ] Verify CI/CD pipeline passes
3. [ ] Final code review on main
4. [ ] Merge to main
5. [ ] Verify production deployment succeeds
6. [ ] Smoke test production build
7. [ ] Announce release
8. [ ] Create GitHub Release with changelog

**Acceptance Criteria**:
- ✅ All PR checks pass
- ✅ Merge to main successful
- ✅ Production deployment successful
- ✅ No production errors
- ✅ Performance metrics acceptable

---

## 🔄 Daily Standup Checklist

Each day, update the team on:

- [ ] What did you complete yesterday?
- [ ] What will you work on today?
- [ ] Any blockers or dependencies?
- [ ] Any PRs awaiting review?
- [ ] Coverage/quality metrics status

**Example standup**:
```
Yesterday:
- Implemented EMI formula in @shared
- Added 8 unit tests

Today:
- Add edge case tests
- Verify benchmark calculations

Blockers:
- None

PRs:
- #42 ready for review (calculateEMI implementation)

Metrics:
- Coverage: 78% → target 80%
```

---

## ✅ Code Review Process

### Reviewer Responsibilities

1. **Check Type Safety**
   - No `any` types?
   - All variables properly typed?
   - Zod schemas used for validation?

2. **Verify Testing**
   - Tests cover happy path?
   - Edge cases tested?
   - Coverage ≥80%?

3. **Performance Review**
   - No unnecessary re-renders?
   - No large bundle bloat?
   - Efficient calculations?

4. **Security Audit**
   - No secrets in code?
   - Dependencies checked?
   - Input validation applied?

5. **Accessibility Check**
   - Semantic HTML used?
   - ARIA labels present?
   - Keyboard navigation works?

### Approval Criteria

Approve when:
- ✅ All code review comments addressed
- ✅ CI/CD pipeline passes
- ✅ Coverage maintained (≥80%)
- ✅ No security concerns
- ✅ Performance acceptable
- ✅ Documentation complete

### Comment Types

| Type | Example | Action |
| --- | --- | --- |
| **Request Changes** | "This needs a test case" | Reviewer suggests changes before merge |
| **Approve** | "Looks good! Ready to merge" | PR can be merged |
| **Comment** | "FYI: This pattern is used elsewhere" | Informational, doesn't block |

---

## 🚀 Deployment Checklist

Before merging to `main`:

**Code Quality** (Automated)
- [ ] ESLint passes
- [ ] Prettier formatting applied
- [ ] TypeScript strict mode passes
- [ ] All tests pass (unit + E2E)
- [ ] Coverage ≥80%

**Security** (Automated + Manual)
- [ ] Dependency audit passes
- [ ] No secrets in code
- [ ] Environment variables validated

**Performance** (Manual)
- [ ] Build time <30s
- [ ] Bundle size reasonable
- [ ] No React warnings

**Documentation** (Manual)
- [ ] README updated (if needed)
- [ ] Comments added for complex logic
- [ ] Changelog entry created

**Review** (Manual)
- [ ] 1-2 peer reviews approved
- [ ] Senior dev signed off
- [ ] Product owner verified requirements

---

## 📈 Metrics & Reporting

### Weekly Metrics Review

Track these metrics weekly:

| Metric | Target | Current | Status |
| --- | --- | --- | --- |
| Test Coverage | ≥80% | 85% | 🟢 |
| Build Time | <30s | 22s | 🟢 |
| CI Pass Rate | 100% | 98% | 🟡 |
| Security Audit | 0 high | 0 | 🟢 |
| Code Review Time | <24h | 18h | 🟢 |

### Monthly Report

Generate monthly report including:
- Number of features shipped
- Bug fixes deployed
- Performance improvements
- Security updates
- Team velocity
- Coverage trends

---

## 🐛 Bug Triage Process

### When a Bug is Reported

1. **Reproduce**: Verify the bug can be reproduced
2. **Assess**: Determine severity and scope
3. **Prioritize**: High/Medium/Low priority
4. **Assign**: Assign to appropriate developer
5. **Fix**: Create bugfix branch
6. **Test**: Add regression test
7. **Review**: Get code review
8. **Deploy**: Merge and deploy

### Severity Levels

| Severity | Description | Fix Timeline |
| --- | --- | --- |
| **Critical** | App crashes, data loss, security issue | Same day |
| **High** | Major feature broken, users blocked | 1-2 days |
| **Medium** | Feature works but incorrectly | 1 week |
| **Low** | Minor UI issue, typo, improvement | 2+ weeks |

---

## 📚 Knowledge Transfer

### Onboarding New Developers

1. **Week 1**: Read documentation, run `pnpm dev`, explore codebase
2. **Week 2**: Fix a small bug or improve a test
3. **Week 3**: Implement a small feature
4. **Week 4**: Lead a feature independently

### Documentation Updates

When implementing a feature, update:
- [ ] TECHNICAL_DESIGN_DOCUMENT.md (if architecture changes)
- [ ] ENGINEERING_ONBOARDING.md (if new process)
- [ ] CONTRIBUTING.md (if new conventions)
- [ ] README.md (if public API changes)
- [ ] Inline code comments (for complex logic)

---

## 🎯 Success Criteria

The project is successful when:

- ✅ All features implemented and tested
- ✅ Coverage ≥80% maintained
- ✅ Zero critical/high security vulnerabilities
- ✅ Zero regressions in production
- ✅ Team can onboard new developers quickly
- ✅ Deployment process is automated
- ✅ Code reviews are constructive and fast
- ✅ Documentation is current and clear

---

## 📞 Escalation Path

If you encounter blockers:

1. **Technical Question?** → Ask in Slack/Discord
2. **Code Review Stuck?** → Tag senior dev
3. **Bug in Production?** → Escalate immediately
4. **Architectural Question?** → Senior dev + team discussion
5. **Resource Constraint?** → Escalate to project manager

---

**Last Updated**: January 20, 2026  
**Version**: 1.0  
**Maintained By**: Engineering Team
