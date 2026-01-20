# 🚀 PHASE 1 LAUNCH BRIEF

**Status**: ✅ TEAM AUTHORIZATION APPROVED  
**Date**: January 20, 2026  
**Target Completion**: January 23, 2026 (EOD)  
**Owner**: Senior Engineering Team

---

## 🎯 Mission Statement

**Your mission**: Deliver the `@loan-calc/shared` package as a production-grade calculation engine with comprehensive validation and ≥80% test coverage.

**Success looks like**: By EOD January 23, the team ships three merged features to the `develop` branch:
1. ✅ EMI Formula implementation (`calculateEMI`)
2. ✅ Zod validation schema (`LoanInputSchema`)
3. ✅ Comprehensive unit tests (Vitest) with ≥80% coverage

---

## 📋 What You Need to Know (5-Min Read)

### The Three Features

#### Feature 1.1: EMI Formula
- Implement: `calculateEMI(data: LoanInput): number`
- Formula: $\frac{P \times R \times (1+R)^N}{(1+R)^N - 1}$
- Location: `packages/shared/src/index.ts`
- **Deliverable**: Function + type definitions

#### Feature 1.2: Zod Validation
- Implement: `LoanInputSchema` with Zod
- Validations: Principal (positive, max 10M), Rate (0.1-100%), Tenure (1-360 months)
- Location: `packages/shared/src/index.ts`
- **Deliverable**: Schema + type inference

#### Feature 1.3: Unit Tests
- Implement: Vitest test suite with 5+ benchmarks + edge cases
- Coverage: ≥80% minimum (target 85%)
- Location: `packages/shared/src/__tests__/index.test.ts`
- **Deliverable**: All tests passing + coverage report

### Success Criteria (Non-Negotiable)

For EVERY feature:
1. ✅ **The Code**: Strict TypeScript, ESLint clean, Prettier formatted
2. ✅ **The Test**: Unit tests with ≥80% coverage, all passing
3. ✅ **The ADR**: Architecture Decision Record explaining "why"

### Daily Timeline

| Day | Feature | Deadline |
| --- | --- | --- |
| **Day 1** | Feature 1.1 (EMI Formula) | EOD Jan 21 |
| **Day 2** | Feature 1.2 (Zod Schema) | EOD Jan 22 |
| **Day 3** | Feature 1.3 (Unit Tests) | EOD Jan 23 |

---

## 🛠️ How to Get Started

### Step 1: Read the Roadmap (10 min)
```bash
# Open this document first
cat docs/MVP_ROADMAP.md | grep -A 50 "PHASE 1: Core"
```

### Step 2: Understand Success Metrics (10 min)
```bash
# Know what success looks like
cat docs/SUCCESS_METRICS.md | head -100
```

### Step 3: Understand Code Review Process (10 min)
```bash
# See the PR submission template and review checklist
cat docs/CODE_REVIEW_FRAMEWORK.md | grep -A 20 "PR Submission Template"
```

### Step 4: Set Up Your Branch (5 min)
```bash
# Create feature branch (naming: feature/1-X-[description])
git checkout develop
git pull origin develop
git checkout -b feature/1-1-emi-formula

# Or for Feature 1.2 or 1.3
git checkout -b feature/1-2-zod-schema
git checkout -b feature/1-3-unit-tests
```

### Step 5: Implement Feature (2-4 hours per feature)
```bash
# Start coding in packages/shared/src/
# Reference: docs/MVP_ROADMAP.md section on your feature

# Test locally
pnpm test
pnpm typecheck
pnpm lint
```

### Step 6: Submit PR (30 min)
```bash
# Push your branch
git push -u origin feature/1-X-[name]

# Use template from docs/CODE_REVIEW_FRAMEWORK.md
# Include:
#   - Code (strict TypeScript)
#   - Tests (≥80% coverage)
#   - ADR (Architecture Decision Record)
#   - AC checklist (Acceptance Criteria)
```

### Step 7: Code Review (24-48 hours)
- 2 approvals required (1 senior + 1 peer)
- Respond to feedback
- Re-submit if changes requested
- Merge when approved

---

## 📖 Essential Reading (in order)

| Document | Time | Priority |
| --- | --- | --- |
| [MVP_ROADMAP.md](./MVP_ROADMAP.md) | 20 min | 🔴 MUST READ |
| [CODE_REVIEW_FRAMEWORK.md](./CODE_REVIEW_FRAMEWORK.md) | 20 min | 🔴 MUST READ |
| [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) | 15 min | 🟡 SHOULD READ |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 15 min | 🟡 SHOULD READ |
| [TECHNICAL_DESIGN_DOCUMENT.md](./TECHNICAL_DESIGN_DOCUMENT.md) | 25 min | 🟢 NICE TO READ |

**Total**: ~1.5 hours to be fully prepared

---

## 💻 Commands You'll Use (Copy-Paste Ready)

### Daily Commands
```bash
# Start your day
git checkout develop
git pull origin develop

# Check test coverage
pnpm test:coverage

# Verify code quality before commit
pnpm typecheck && pnpm lint && pnpm format:check && pnpm test

# Create commit with message
git add .
git commit -m "feat: implement EMI formula calculation"

# Push to remote
git push origin feature/1-1-emi-formula
```

### When Stuck
```bash
# Check if you're in the right directory
pwd  # Should be: /home/t043r/Saikit Systems /lemic-app

# Verify all configs are valid
pnpm install

# Run specific test file
pnpm test -- src/__tests__/index.test.ts

# Format all files
pnpm format

# Fix ESLint issues
pnpm lint -- --fix
```

---

## 🎯 Benchmark Tests (Know These!)

Your tests MUST verify these calculations are accurate:

```typescript
// Test Case 1: Standard loan
Principal: 100,000
Rate: 12% p.a.
Tenure: 12 months
Expected EMI: ₹8,884.88

// Test Case 2: Large loan
Principal: 500,000
Rate: 10% p.a.
Tenure: 60 months
Expected EMI: ₹10,606.06

// Test Case 3: Short tenure
Principal: 50,000
Rate: 2% p.a.
Tenure: 24 months
Expected EMI: ₹2,097.15

// Test Case 4: Edge case (0% interest)
Principal: 100,000
Rate: 0% p.a.
Tenure: 12 months
Expected EMI: ₹8,333.33 (principal ÷ months)

// Test Case 5: Edge case (1 month)
Principal: 100,000
Rate: 12% p.a.
Tenure: 1 month
Expected EMI: > 100,000 (includes interest)
```

---

## 🚨 Common Mistakes to Avoid

### ❌ DON'T

1. **Submit PR without ADR** → You need to explain your decisions
2. **Coverage <80%** → Non-negotiable minimum
3. **TypeScript errors** → Pre-commit hooks will block you
4. **Forget to run tests locally** → Always `pnpm test` before push
5. **Use `any` types** → This will get rejected in review
6. **Skip edge cases in tests** → Include boundary conditions
7. **Merge without 2 approvals** → Wait for code review
8. **Commit directly to `main` or `develop`** → Always use feature branches

### ✅ DO

1. **Read the roadmap carefully** → Know your AC before coding
2. **Write tests FIRST** → TDD approach mandatory
3. **Document with ADR** → Explain your "why"
4. **Run all checks locally** → `pnpm typecheck && pnpm lint && pnpm test`
5. **Ask for clarification** → No question is dumb
6. **Respond to code review promptly** → Within 24 hours
7. **Help teammates** → Code review feedback helps everyone
8. **Celebrate milestones** → When feature merges, celebrate! 🎉

---

## 📞 Getting Help

### I have a question about...

**"What's the EMI formula?"**  
→ See [MVP_ROADMAP.md](./MVP_ROADMAP.md) Feature 1.1 section

**"What should I test?"**  
→ See [MVP_ROADMAP.md](./MVP_ROADMAP.md) Feature 1.3 section for test cases

**"How do I write an ADR?"**  
→ See [CODE_REVIEW_FRAMEWORK.md](./CODE_REVIEW_FRAMEWORK.md) - ADR Template section

**"What's the PR submission process?"**  
→ See [CODE_REVIEW_FRAMEWORK.md](./CODE_REVIEW_FRAMEWORK.md) - PR Submission Template

**"What are success metrics?"**  
→ See [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) - Code Quality Metrics section

**"How do I run tests?"**  
→ `pnpm test` (all tests) or `pnpm test -- filename` (specific test)

**"TypeScript errors?"**  
→ Run `pnpm typecheck` to see all errors

**"Linting issues?"**  
→ Run `pnpm lint -- --fix` to auto-fix

**"Coverage too low?"**  
→ Run `pnpm test:coverage` to see what's missing

**Something else?**  
→ Ask in Slack or create a GitHub Discussion

---

## 📊 Phase 1 Accountability (Sign-Off)

By EOD January 23, the team signs off on:

- ✅ **All Features Merged**: Features 1.1, 1.2, 1.3 merged to develop
- ✅ **Code Quality**: 0 TypeScript errors, 0 ESLint violations
- ✅ **Coverage**: ≥80% achieved
- ✅ **Tests Passing**: 100% pass rate
- ✅ **Code Review**: All PRs approved (2 reviewers each)
- ✅ **ADRs Complete**: All decisions documented
- ✅ **No Regressions**: All previous fixes remain fixed

**Sign-Off**: Senior dev approves → Phase 2 authorization

---

## 🚀 What Happens Next

### When Phase 1 Is Done
→ Team gets 1-day break  
→ Senior dev reviews all merged code  
→ Phase 2 kickoff: Frontend UI & React Hook Form  

### Your Growth Path
- Phase 1: You learn the codebase and patterns
- Phase 2: You build user-facing features
- Phase 3: You integrate with backend systems
- Phase 4: You ship a production app

### The Big Picture
This is not just a calculator. You're building:
- ✅ Production-grade architecture
- ✅ Quality gate discipline
- ✅ Team collaboration patterns
- ✅ Code review excellence
- ✅ Testing culture

**This experience will level you up as an engineer.**

---

## ✨ Final Words

You have everything you need to succeed:
- ✅ Clear roadmap with feature specs
- ✅ Detailed acceptance criteria
- ✅ Success metrics to track progress
- ✅ Code review framework with templates
- ✅ Comprehensive documentation
- ✅ Experienced reviewers ready to help

**The only thing you need now is to start.**

---

## 🎯 Your First Action (Right Now!)

### Task 1: Read the Roadmap
```bash
cat docs/MVP_ROADMAP.md
# Time: 20 minutes
# Focus: Phase 1 section, Feature 1.1 to 1.3
```

### Task 2: Create Your Branch
```bash
git checkout develop
git pull origin develop
git checkout -b feature/1-1-emi-formula
# Choose feature 1-1, 1-2, or 1-3 depending on assignment
```

### Task 3: Open the Feature Spec
```bash
# Open docs/MVP_ROADMAP.md in your editor
# Jump to your assigned feature section
# Copy the "Code Template" to get started
```

### Task 4: Start Coding
```bash
# Edit packages/shared/src/index.ts
# Implement your feature
# Run: pnpm test to verify
```

---

**You're ready. Go build something great.** 🚀

---

**Questions?** Check [docs/INDEX.md](./INDEX.md) for the FAQ  
**Stuck?** Ask in the team Slack or GitHub Discussions  
**Ready?** Create your branch and start coding!

---

**Phase 1 Starts**: January 20, 2026  
**Phase 1 Ends**: January 23, 2026 (EOD)  
**Authorization**: ✅ APPROVED - GO BUILD

