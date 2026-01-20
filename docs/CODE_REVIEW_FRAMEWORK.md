# 🔍 CODE REVIEW FRAMEWORK & ADR TEMPLATE

**Version**: 1.0  
**Date**: January 20, 2026  
**Owner**: Senior Engineering Team  
**Purpose**: Standardize code reviews and architectural decisions

---

## 🎯 Overview

This framework ensures that **every pull request** receives consistent, thorough reviews focused on:
1. **Correctness**: Does the code solve the problem?
2. **Quality**: Is it maintainable and well-tested?
3. **Architecture**: Is the design sound and scalable?
4. **Security**: Are there vulnerabilities or risks?

---

## 📋 Phase 1 Code Review Checklist

### Automated Checks (Must Pass Before Review)
- [ ] `pnpm typecheck` passes (0 errors)
- [ ] `pnpm lint` passes (0 violations)
- [ ] `pnpm format` passes (all formatted)
- [ ] `pnpm test` passes (100% pass rate)
- [ ] Coverage ≥80%
- [ ] No merge conflicts

### Feature 1.1: EMI Formula Review

**Reviewer Checklist**:

#### Mathematical Correctness
- [ ] Formula matches specification: $\frac{P \times R \times (1+R)^N}{(1+R)^N - 1}$
- [ ] Monthly rate calculation: `annualRate / (12 * 100)` ✅
- [ ] Exponent handling: `Math.pow(1 + r, tenureMonths)` ✅
- [ ] No divide-by-zero errors
- [ ] Handles edge cases (r=0, N=1)
- [ ] Returns number type
- [ ] Precision: Accurate to 2+ decimal places

**Benchmark Verification**:
```typescript
// Reviewer must verify these exact values:
const tests = [
  { principal: 100000, rate: 12, months: 12 → 8884.88 },
  { principal: 500000, rate: 10, months: 60 → 10606.06 },
  { principal: 50000, rate: 2, months: 24 → 2097.15 },
];
```

#### Code Quality
- [ ] No `any` types
- [ ] Function signature is clear
- [ ] Variable names are descriptive
- [ ] Comments explain complex logic
- [ ] No console.log or debug statements
- [ ] Follows naming conventions

#### Type Safety
- [ ] Input type: `LoanInput` (typed)
- [ ] Return type: `number` (explicit)
- [ ] All calculations use correct types
- [ ] No implicit type coercion

---

### Feature 1.2: Zod Schema Review

**Reviewer Checklist**:

#### Validation Rules
- [ ] Principal: `positive()` and `max(10000000)`
- [ ] Rate: `min(0.1)` and `max(100)`
- [ ] Tenure: `int()`, `min(1)`, `max(360)`
- [ ] All error messages are user-friendly
- [ ] Rejects invalid inputs correctly

**Test All Rejection Scenarios**:
```typescript
// Reviewer should test:
{ principal: -1 } → Rejected
{ principal: 0 } → Rejected
{ rate: 0 } → Rejected
{ rate: 101 } → Rejected
{ months: 0 } → Rejected
{ months: 361 } → Rejected
```

#### Type Export
- [ ] `LoanInput` type exported
- [ ] Type matches schema
- [ ] Type inference works: `z.infer<typeof LoanInputSchema>`
- [ ] Consumers can import and use type

#### Edge Cases
- [ ] Decimal inputs handled
- [ ] String coercion (if needed)
- [ ] Maximum values validated
- [ ] Minimum values validated

---

### Feature 1.3: Unit Tests Review

**Reviewer Checklist**:

#### Test Coverage
- [ ] Benchmark cases: ✅ 3+ cases with known-good values
- [ ] Edge cases: ✅ Zero interest, 1-month tenure, max values
- [ ] Validation errors: ✅ Rejects invalid inputs
- [ ] Accuracy: ✅ Calculations verified to 2 decimals
- [ ] Coverage: ✅ ≥80% statement coverage

#### Test Quality
- [ ] Each test has clear description
- [ ] Tests are independent (no shared state)
- [ ] Assertions are specific (`toBeCloseTo`, not `toBeTruthy`)
- [ ] Error messages are helpful
- [ ] No skipped tests (`it.skip`)
- [ ] No focused tests (`it.only`)

#### Test Execution
- [ ] All tests pass locally
- [ ] All tests pass in CI/CD
- [ ] No flaky tests
- [ ] Coverage report generated

---

## 👥 Code Review Role Assignments

### Phase 1 Team Structure

| Role | Reviewer | Authority |
| --- | --- | --- |
| **Primary Reviewer** | Senior Dev | Must approve before merge |
| **Secondary Reviewer** | Peer Developer | Should approve (optional) |
| **Architectural Reviewer** | TL/Architect | For ADR validation |

**Approval Rule**: Minimum 2 approvals required (can be 1 senior + 1 peer)

---

## 📋 PR Submission Template

**Every PR must include:**

### PR Title Format
```
[Phase 1] Feature 1.1: Implement EMI Formula
```

### PR Description
```markdown
## What does this PR do?
- Implements EMI calculation formula in @loan-calc/shared
- Adds comprehensive input validation with Zod
- Includes unit tests with ≥80% coverage

## How was this tested?
- [ ] Ran `pnpm test` (all passing)
- [ ] Ran `pnpm typecheck` (0 errors)
- [ ] Ran `pnpm lint` (0 violations)
- [ ] Manual testing: [describe]

## Acceptance Criteria Met
- [x] AC1.1.1: Function accepts LoanInput type
- [x] AC1.1.2: Returns number type
- [x] AC1.1.3: Handles numeric edge cases
- [x] AC1.1.4: No TypeScript errors
- [x] AC1.1.5: Code formatted per Prettier
- [x] AC1.1.6: No ESLint violations

## ADR
- [x] Architecture Decision Record attached below

## Related Issue(s)
- Closes [Roadmap Feature 1.1]

---

## Architecture Decision Record

[See template below]
```

---

## 📐 Architecture Decision Record (ADR) Template

**Every feature must include an ADR explaining the "why" behind design choices.**

### Template

```markdown
# ADR-[###]: [Decision Title]

**Status**: Proposed | **Last Updated**: [Date]

## 1. Context

What is the issue we're trying to solve? What are the constraints?

**Example**:
> We need to calculate compound interest for EMI formula (1+R)^N.
> 
> Constraints:
> - Must be accurate to 2 decimal places
> - Must handle tenures up to 360 months
> - Must be performant (<10ms)

## 2. Options Considered

List all reasonable alternatives and pros/cons.

### Option A: Use Math.pow()
**Pros**:
- Optimized in JS engines
- Industry standard
- Readable

**Cons**:
- None significant

### Option B: Use manual loop
**Pros**:
- More explicit
- Can add logging

**Cons**:
- Slower
- More code to maintain
- Harder to test

### Option C: Use BigDecimal library
**Pros**:
- Arbitrary precision
- Better for accounting

**Cons**:
- Extra dependency
- Slower for our use case
- Overkill for this problem

## 3. Decision

**We chose: Option A (Math.pow)**

### Rationale
- JavaScript's Math.pow is optimized and fast
- Sufficient precision for EMI calculations
- Industry standard approach
- Minimal dependencies
- Clear and maintainable code

## 4. Consequences

### Positive
- ✅ Fast execution (<10ms)
- ✅ Minimal dependencies
- ✅ Industry standard
- ✅ Easy to test

### Negative
- ⚠️ Floating-point precision could be edge case at scale
- ⚠️ Requires rounding to 2 decimals for display

### Mitigation
- Always round to 2 decimals before display
- Test edge cases for precision
- Document rounding approach

## 5. Future Considerations

- If we need arbitrary precision: Evaluate BigDecimal
- If performance becomes issue: Consider memoization
- If calculations become complex: Evaluate number theory library

---

## References
- [IEEE 754 Floating Point Standard](https://en.wikipedia.org/wiki/IEEE_754)
- [JavaScript Math.pow Performance](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/pow)
```

---

## ✅ Review Approval Rules

### When Can a PR Be Merged?

**ALL** of the following must be true:

1. ✅ **Automated Checks Pass**
   - `pnpm typecheck` → 0 errors
   - `pnpm lint` → 0 violations
   - `pnpm format` → all formatted
   - `pnpm test` → 100% pass
   - Coverage ≥80%

2. ✅ **Code Review Approved**
   - Minimum 2 approvals (1 senior + 1 peer, or 2 senior)
   - All comments resolved
   - No requested changes pending

3. ✅ **Acceptance Criteria Met**
   - All ACs from Phase roadmap completed
   - ADR attached and reviewed

4. ✅ **No Conflicts**
   - No merge conflicts with develop
   - No git issues
   - Branch is up-to-date

### When Should a PR Be Rejected?

**Reject (request changes) if:**

❌ TypeScript errors present  
❌ Test coverage <80%  
❌ ESLint violations  
❌ Code not formatted  
❌ Tests failing  
❌ AC not met  
❌ ADR missing  
❌ Merge conflicts  
❌ No description/context  

---

## 🎯 Common Review Comments

### ✅ Approve Comments
```
✅ LGTM - All checks pass, ADR well-reasoned, merging now
```

### 🟡 Request Changes Comments
```
🔍 REQUEST CHANGES:

1. TypeScript: Variable `r` should be named `monthlyRate` for clarity
2. Test: Missing edge case for tenure=1 month
3. ADR: Please explain why not using a loop?

Please address and resubmit.
```

### ⚠️ Block/Reject Comments
```
🚫 BLOCK - Cannot merge due to:

1. Coverage is 75%, below 80% minimum
2. Test failing: "Edge Case 2: 1-month tenure"
3. TypeScript error: "Implicit any"

Please fix and resubmit. Merging blocked until these are resolved.
```

---

## 📊 Code Review Metrics

Track these metrics for each PR:

| Metric | Target | Status |
| --- | --- | --- |
| Time to first review | <4 hours | ⏳ Tracking |
| Time to approval | <24 hours | ⏳ Tracking |
| Review cycles (iterations) | 1-2 | ⏳ Tracking |
| Approval consistency | 2+ reviewers | ⏳ Tracking |
| ADR completeness | 100% | ⏳ Tracking |

---

## 🚀 Phase 1 Specific Reviews

### PR 1: Feature 1.1 (EMI Formula)
- **Estimated review time**: 30-45 min
- **Reviewers**: Senior Dev + Peer Dev
- **Critical checks**: Math accuracy, type safety, edge cases
- **ADR**: Why Math.pow?

### PR 2: Feature 1.2 (Zod Schema)
- **Estimated review time**: 20-30 min
- **Reviewers**: Senior Dev + Peer Dev
- **Critical checks**: Validation rules, error messages, edge cases
- **ADR**: Why these validation bounds?

### PR 3: Feature 1.3 (Unit Tests)
- **Estimated review time**: 30-45 min
- **Reviewers**: Senior Dev + QA/Peer Dev
- **Critical checks**: Coverage, test quality, benchmarks
- **ADR**: Why these specific test cases?

---

## 📞 Review SLA

| Time | Action |
| --- | --- |
| **<4 hours** | First review assigned |
| **<12 hours** | Initial feedback provided |
| **<24 hours** | Approval/rejection decision |
| **>24 hours** | Escalate to TL if stuck |

---

## ✨ Review Best Practices

### For Reviewers
1. ✅ Read the entire PR description first
2. ✅ Understand the ADR and design rationale
3. ✅ Check automated metrics first
4. ✅ Ask clarifying questions, don't assume
5. ✅ Approve if all criteria met
6. ✅ Be constructive, not critical

### For Authors
1. ✅ Write clear PR descriptions
2. ✅ Include comprehensive ADR
3. ✅ Ensure all automated checks pass before submission
4. ✅ Link to roadmap features
5. ✅ Respond to feedback promptly
6. ✅ Update code and resubmit

---

## 🎓 Code Review Learning

After each review cycle, capture learnings:

```markdown
## Review Learning Log

### PR 1 Learnings
- ✅ Excellent: Clear ADR rationale
- 🔍 To improve: Add more edge case tests
- 💡 For next PR: Document benchmarks upfront

### PR 2 Learnings
- ✅ Excellent: Comprehensive validation
- 🔍 To improve: Error messages could be more specific
- 💡 For next PR: Include user examples

### PR 3 Learnings
- ✅ Excellent: Well-structured tests
- 🔍 To improve: Add performance benchmarks
- 💡 For next PR: Include coverage visualization
```

---

**Next Action**: 

1. Team prepares PR for Feature 1.1 (EMI Formula)
2. Submits with: Code + Tests + ADR + Acceptance Criteria checklist
3. Reviews assigned to Senior Dev + Peer Dev
4. Target: Approval <24 hours

Ready to review the Phase 1 implementation! 🚀

