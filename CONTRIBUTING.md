# Contributing Guidelines

> Thank you for contributing to the Loan EMI Calculator! This document outlines how to contribute effectively to the project while maintaining our high quality standards.

---

## 🎯 Our Development Philosophy

We believe in:
- **Type Safety First**: Every line of code is type-checked
- **Test-Driven Development**: Tests are written before or alongside code
- **Zero Regressions**: All features must have passing tests
- **Accessibility by Default**: WCAG 2.1 AA compliance is non-negotiable
- **Security as a Service**: Dependencies are audited weekly

---

## 🌿 Branch Workflow

```
main (production-ready)
  ↑
  └── develop (integration branch)
      ↑
      └── feature/xyz (your work)
      └── fix/xyz
      └── chore/xyz
```

### Branch Naming Convention

- `feature/calculator-amortization` - New features
- `fix/emi-rounding-precision` - Bug fixes
- `test/add-edge-case-tests` - Test additions
- `docs/update-api-guide` - Documentation
- `chore/upgrade-dependencies` - Maintenance

---

## 📝 Before You Start

1. **Check existing issues** - Avoid duplicate work
2. **Discuss major changes** - Open a discussion or issue first
3. **Keep features small** - Easier to review and test
4. **Read the architecture** - See `docs/TECHNICAL_DESIGN_DOCUMENT.md`

---

## ✍️ Commit Message Format

We follow **Semantic Commit Messages**:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style (formatting, missing semicolons, etc.)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Test additions or modifications
- `chore` - Build, CI/CD, dependency updates

### Scope

- `calculator` - EMI calculator logic
- `validation` - Input validation
- `ui` - User interface
- `shared` - Shared package
- `ci` - CI/CD pipeline

### Examples

```
feat(calculator): add support for custom compounding frequencies

fix(validation): handle division by zero in EMI calculation

docs(readme): update setup instructions for pnpm

test(calculator): add edge case tests for zero interest rate

refactor(validation): extract schema logic to separate file

perf(calculator): optimize formula calculation for large tenures
```

---

## 🔄 Pull Request Process

### 1. Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/my-feature
```

### 2. Implement & Test

```bash
# Make your changes
# Write tests alongside your code

# Verify quality
pnpm lint --fix
pnpm format
pnpm typecheck
pnpm test
pnpm e2e
```

### 3. Commit & Push

```bash
git add .
git commit -m "feat(scope): description"
git push origin feature/my-feature
```

### 4. Create Pull Request

- Title should match commit message format
- Description should include:
  - What problem does this solve?
  - How did you implement it?
  - How can it be tested?
  - Screenshots (if UI changes)

**Example PR Description:**

```markdown
## Description
Improves EMI calculation precision by implementing Banker's rounding instead of standard rounding.

## Problem
Current calculation uses Math.round() which can introduce rounding errors for large loan amounts.

## Solution
Implemented Banker's rounding algorithm which reduces rounding bias.

## Testing
- Added unit tests in `packages/shared/__tests__/rounding.test.ts`
- E2E test verifies calculation accuracy for benchmark cases
- Coverage: 95%

## Checklist
- [x] Tests pass
- [x] Coverage >= 80%
- [x] Code is formatted
- [x] No TypeScript errors
- [x] No ESLint violations
```

### 5. Code Review

- Be open to feedback
- Engage constructively with reviewers
- Make requested changes and push updates
- Resolve all conversations before merge

### 6. Merge to Develop

Once approved:
- Rebase onto latest develop (or squash if needed)
- Merge with a clear commit message
- Delete feature branch

---

## ✅ Code Review Checklist

When reviewing PRs, check:

- [ ] **Type Safety**: No `any` types, proper TypeScript usage
- [ ] **Tests**: All new code has tests (unit + E2E if needed)
- [ ] **Coverage**: ≥80% statement coverage maintained
- [ ] **Performance**: No unnecessary re-renders or inefficient loops
- [ ] **Security**: No secrets exposed, no vulnerable dependencies
- [ ] **Accessibility**: UI changes follow WCAG 2.1 AA
- [ ] **Documentation**: Comments and inline docs where needed
- [ ] **Formatting**: Code follows style guide (auto-checked via hooks)

---

## 🧪 Testing Requirements

### Unit Tests (Vitest)

Required for:
- Mathematical formulas
- Validation logic
- Utility functions

**Minimum coverage**: 80% statement coverage

```typescript
// Good test structure
describe('calculateEMI', () => {
  it('calculates correctly for standard case', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8884.88, 2);
  });

  it('handles edge case with 0% interest', () => {
    const result = calculateEMI({
      principal: 100000,
      annualRate: 0,
      tenureMonths: 12,
    });
    expect(result).toBeCloseTo(8333.33, 2);
  });

  it('rejects invalid input', () => {
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

### E2E Tests (Playwright)

Required for:
- User workflows
- Form interactions
- Result display

```typescript
test('calculates EMI for user input', async ({ page }) => {
  await page.goto('/');
  
  // User enters values
  await page.fill('input[name="principal"]', '100000');
  await page.fill('input[name="annualRate"]', '12');
  await page.fill('input[name="tenureMonths"]', '12');
  
  // User submits form
  await page.click('button[type="submit"]');
  
  // Result is displayed
  await expect(page.locator('text=8,884.88')).toBeVisible();
});
```

---

## 🚀 Performance Guidelines

### React Components

- Use `React.memo()` for expensive components
- Minimize prop drilling
- Use `useCallback()` for event handlers
- Use `useMemo()` for computed values

### Form Handling

- Use React Hook Form to minimize re-renders
- Don't validate on every keystroke (use debounce if needed)
- Leverage Zod for runtime validation

### Calculations

- Cache results when possible
- Use Turbo for build caching
- Profile with browser DevTools

---

## 📚 Documentation

### Code Comments

Write comments for **why**, not **what**:

```typescript
// ❌ Bad: This comment just repeats the code
// Convert annual rate to monthly rate
const monthlyRate = annualRate / 12 / 100;

// ✅ Good: This explains the business logic
// Divide by 12 for monthly, by 100 to convert from percentage
// e.g., 12% annual = 1% monthly = 0.01
const monthlyRate = annualRate / 12 / 100;
```

### Documentation Files

- **README.md**: Project overview and quick start
- **ENGINEERING_ONBOARDING.md**: Developer guide
- **TECHNICAL_DESIGN_DOCUMENT.md**: Architecture decisions
- **Inline comments**: Complex logic explanation
- **ADRs**: Significant architectural decisions

---

## 🔐 Security Checklist

Before submitting a PR:

- [ ] No hardcoded API keys or secrets
- [ ] No `console.log()` with sensitive data
- [ ] Dependencies are checked with `pnpm audit`
- [ ] Input is validated with Zod
- [ ] SQL/database queries use parameterized statements (when applicable)
- [ ] Authentication/authorization is properly implemented

---

## ♿ Accessibility Checklist

- [ ] Semantic HTML used (`<button>` not `<div onclick>`)
- [ ] ARIA labels for form inputs
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Color is not the only differentiator
- [ ] Text has sufficient contrast
- [ ] Images have alt text
- [ ] Form errors are announced to screen readers

---

## 🐛 Reporting Bugs

### What to Include

1. **Reproduction steps**: How to reproduce the bug
2. **Expected behavior**: What should happen
3. **Actual behavior**: What actually happens
4. **Screenshots/videos**: Visual evidence (if applicable)
5. **Environment**: OS, Node version, browser (if frontend)

### Example Bug Report

```markdown
## Bug: EMI calculation shows incorrect result for very high interest rates

### Reproduction Steps
1. Enter principal: 50,000
2. Enter annual rate: 36% (e.g., credit card rate)
3. Enter tenure: 12 months
4. Click Calculate

### Expected Behavior
EMI should be approximately 4,732.45

### Actual Behavior
EMI shows: 4,700.00 (incorrect)

### Environment
- OS: macOS 13.1
- Node: v18.12.0
- Browser: Chrome 109
```

---

## 🎓 Learning Resources

- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- **React**: [React Documentation](https://react.dev/)
- **Zod**: [Zod Validation Library](https://zod.dev/)
- **Testing**: [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/)
- **Git**: [Git SCM Documentation](https://git-scm.com/doc)

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful to all contributors
- Welcome diverse perspectives
- Address conflicts constructively
- Report violations to the project maintainers

---

## 📞 Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug Report?** Create an Issue
- **Feature Request?** Open an Issue with `[FEATURE]` label
- **Need Review?** Tag maintainers in your PR

---

## 🎉 Thank You!

Thank you for contributing to making the Loan EMI Calculator better. Your efforts help maintain high quality standards and improve the project for everyone.

---

**Last Updated**: January 20, 2026  
**Maintained By**: Engineering Team
