# ⚡ PHASE 1 QUICK REFERENCE CARD

**Print this. Pin it on your desk. Reference it daily.**

---

## 🎯 Your Mission (In 30 Seconds)

**By EOD Jan 23**, deliver three features to `develop` branch:

1. **EMI Formula** (`calculateEMI`) - Day 1
2. **Zod Validation** (`LoanInputSchema`) - Day 2  
3. **Unit Tests** (Vitest suite) - Day 3

✅ **Code** (strict TS) + ✅ **Tests** (≥80% coverage) + ✅ **ADR** (explain why)

---

## 📖 Essential Links

| Document | Time | Use For |
| --- | --- | --- |
| [MVP_ROADMAP.md](./MVP_ROADMAP.md) | 20 min | **READ FIRST** - Feature specs & AC |
| [PHASE_1_LAUNCH_BRIEF.md](./PHASE_1_LAUNCH_BRIEF.md) | 15 min | Step-by-step guide |
| [CODE_REVIEW_FRAMEWORK.md](./CODE_REVIEW_FRAMEWORK.md) | 20 min | Before submitting PR |
| [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) | 15 min | Know what success looks like |

---

## 🛠️ Your Daily Commands

### Morning Standup
```bash
git pull origin develop        # Get latest code
pnpm install                    # Fresh dependencies
pnpm test:coverage              # Check current coverage
```

### During Development
```bash
# Run as you code (every 30 min)
pnpm typecheck                  # Catch type errors
pnpm lint -- --fix              # Auto-fix style issues
pnpm test                       # Run all tests
pnpm format                     # Format code
```

### Before Committing
```bash
pnpm typecheck && \
pnpm lint && \
pnpm format:check && \
pnpm test
# All must pass ✅
```

### Creating Your Branch
```bash
# For Feature 1.1 (EMI Formula)
git checkout -b feature/1-1-emi-formula

# For Feature 1.2 (Zod Schema)
git checkout -b feature/1-2-zod-schema

# For Feature 1.3 (Unit Tests)
git checkout -b feature/1-3-unit-tests
```

### Pushing & Creating PR
```bash
git push -u origin feature/1-X-description
# Then create PR on GitHub with template from CODE_REVIEW_FRAMEWORK.md
```

---

## 🎯 Feature Overview

### Feature 1.1: EMI Formula
**Location**: `packages/shared/src/index.ts`

```typescript
export const calculateEMI = (data: LoanInput): number => {
  const { principal, annualRate, tenureMonths } = data;
  const r = annualRate / (12 * 100);
  const power = Math.pow(1 + r, tenureMonths);
  const emi = (principal * r * power) / (power - 1);
  return emi;
};
```

**Verification**: Test these values are correct
- 100k @ 12% for 12 mo = 8884.88
- 500k @ 10% for 60 mo = 10606.06
- 50k @ 2% for 24 mo = 2097.15

---

### Feature 1.2: Zod Validation
**Location**: `packages/shared/src/index.ts`

```typescript
export const LoanInputSchema = z.object({
  principal: z.number()
    .positive("Principal must be > 0")
    .max(10000000, "Max 10,000,000"),
  annualRate: z.number()
    .min(0.1, "Min 0.1%")
    .max(100, "Max 100%"),
  tenureMonths: z.number()
    .int("Must be whole number")
    .min(1, "Min 1 month")
    .max(360, "Max 360 months"),
});

export type LoanInput = z.infer<typeof LoanInputSchema>;
```

**Test**: Must reject these values
- principal: -1, 0, 100000001
- rate: -1, 0, 101
- tenure: 0, 361, 1.5

---

### Feature 1.3: Unit Tests
**Location**: `packages/shared/src/__tests__/index.test.ts`

**Must include**:
- ✅ 3+ benchmark cases with known-good values
- ✅ 3+ edge cases (0% interest, 1-month tenure, max values)
- ✅ 3+ validation error tests
- ✅ ≥80% statement coverage
- ✅ All tests passing

---

## ✅ Your Feature Checklist

### Before Committing
- [ ] Feature implemented
- [ ] `pnpm typecheck` passes (0 errors)
- [ ] `pnpm lint` passes (0 violations)
- [ ] `pnpm format` passes (all formatted)
- [ ] `pnpm test` passes (100% green)
- [ ] Coverage ≥80% (for Feature 1.3)

### Before Submitting PR
- [ ] All tests still passing
- [ ] ADR written (why this approach?)
- [ ] PR description complete
- [ ] AC checklist filled out
- [ ] No merge conflicts with develop

### PR Template (Copy-Paste)
```markdown
## What does this PR do?
- [Brief description]

## How was this tested?
- [x] pnpm typecheck passes
- [x] pnpm lint passes
- [x] pnpm format passes
- [x] pnpm test passes (all green)
- [x] Coverage ≥80%

## Acceptance Criteria
- [x] AC1.1.1: [criterion met]
- [x] AC1.1.2: [criterion met]
- [x] AC1.1.3: [criterion met]
[... all ACs from MVP_ROADMAP.md]

## Architecture Decision Record
[Insert ADR from CODE_REVIEW_FRAMEWORK.md template]
```

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
| --- | --- |
| TypeScript error | Run `pnpm typecheck`, fix all errors |
| ESLint violation | Run `pnpm lint -- --fix` |
| Format issue | Run `pnpm format` |
| Test failing | Run `pnpm test -- --reporter=verbose` to debug |
| Low coverage | Run `pnpm test:coverage` to see what's missing |
| Merge conflict | `git merge develop` into your branch, resolve, commit |

---

## 📊 Success Metrics (Track Daily)

```
Code Quality:
  □ TypeScript: 0 errors
  □ ESLint: 0 violations
  □ Coverage: ≥80%
  □ Tests: 100% passing

Team Performance:
  □ Standup: Attended ✓
  □ Blockers: None pending
  □ PR time: <24h for approval
  □ On schedule: ✓

Progress:
  □ Feature 1.1: [%] complete
  □ Feature 1.2: [%] complete
  □ Feature 1.3: [%] complete
```

---

## 💡 Pro Tips

✅ **Write tests FIRST** - Then implement (TDD)  
✅ **Commit often** - Small commits are easier to review  
✅ **Ask for help early** - Don't wait until stuck 2 hours  
✅ **Read ADR examples** - Understand decision patterns  
✅ **Run all checks locally** - Never push failing code  
✅ **Respond to feedback promptly** - Within 24 hours  
✅ **Help teammates review** - Everyone learns faster  
✅ **Celebrate merges** - Acknowledge team wins  

---

## 📞 Quick Help

**"How do I..."**

| Question | Answer |
| --- | --- |
| Start? | Create branch, implement feature, test locally |
| Test? | `pnpm test`, `pnpm test:coverage` |
| Format code? | `pnpm format` (or `pnpm lint -- --fix`) |
| Debug test? | `pnpm test -- --reporter=verbose --reporter=default` |
| Check coverage? | `pnpm test:coverage` |
| Submit PR? | Push branch, use PR template from CODE_REVIEW_FRAMEWORK.md |
| Get feedback? | Ask in Slack or GitHub discussion |
| Fix rejects? | Check [MVP_ROADMAP.md](./MVP_ROADMAP.md) AC section |

---

## ⏰ Timeline

| Date | Milestone | Status |
| --- | --- | --- |
| Jan 20 | Phase 1 kickoff | 🟢 TODAY |
| Jan 21 EOD | Feature 1.1 ready for review | 🟡 NEXT |
| Jan 22 EOD | Feature 1.2 ready for review | 🟡 NEXT |
| Jan 23 EOD | Feature 1.3 ready for review | 🟡 NEXT |
| Jan 24 | Phase 1 sign-off & celebration | 🟡 NEXT |

---

## 🎯 Three Features = 3 PRs = 3 Days

### Day 1: EMI Formula
```
Morning: Read MVP_ROADMAP + LAUNCH_BRIEF
10am: Standup - clarify questions
11am-4pm: Code + Test locally
4pm: Push PR (must pass all checks)
5pm: Await code review
```

### Day 2: Zod Schema
```
Morning: Review code review feedback on PR 1.1
10am: Standup - blockers?
11am: Address feedback on PR 1.1 (if needed)
2pm-5pm: Work on Feature 1.2 + tests
6pm: Push PR 1.2
```

### Day 3: Unit Tests
```
Morning: Review feedback on PR 1.2
10am: Standup - all on track?
11am: Address feedback on PR 1.2 (if needed)
2pm-5pm: Work on Feature 1.3
5pm: Push PR 1.3
6pm-7pm: Final check (all tests passing?)
```

### Day 4: Sign-Off
```
Morning: Senior dev reviews all merged code
Afternoon: Phase 1 complete ✅
4pm: Team celebration 🎉
5pm: Break before Phase 2
```

---

## 🎓 Remember

This isn't just about building a calculator.

You're learning:
- ✅ Production-grade TypeScript patterns
- ✅ Code review excellence
- ✅ TDD discipline
- ✅ Architecture decision-making
- ✅ Team collaboration
- ✅ Quality-first mindset

**Every decision you make now becomes a team pattern.**

---

## ✨ You've Got This

You have:
- ✅ Clear roadmap
- ✅ Detailed specs
- ✅ Benchmark tests
- ✅ Review checklists
- ✅ ADR templates
- ✅ Success metrics
- ✅ Experienced reviewers
- ✅ Full documentation

**No excuses. No ambiguity. Just clarity.**

→ **Read MVP_ROADMAP.md**  
→ **Create your branch**  
→ **Start coding**  

---

**Questions?** Ask in Slack or create GitHub Discussion  
**Stuck?** Reference SUCCESS_METRICS.md escalation matrix  
**Ready?** Your branch is waiting.

**Go build something great.** 🚀

---

**Quick Links**
- 📚 [MVP_ROADMAP.md](./MVP_ROADMAP.md) - Feature specs
- 📋 [PHASE_1_LAUNCH_BRIEF.md](./PHASE_1_LAUNCH_BRIEF.md) - Getting started
- 🔍 [CODE_REVIEW_FRAMEWORK.md](./CODE_REVIEW_FRAMEWORK.md) - PR submission
- 📊 [SUCCESS_METRICS.md](./SUCCESS_METRICS.md) - Success criteria

---

**Version**: 1.0  
**Date**: January 20, 2026  
**Keep this pinned on your monitor** 📌
