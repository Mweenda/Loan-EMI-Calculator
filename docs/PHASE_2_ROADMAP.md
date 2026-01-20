# 📋 PHASE 2 ROADMAP: Professional UI & Interaction

**Version**: 1.0  
**Date**: January 20, 2026  
**Owner**: Senior Engineering Team  
**Status**: QUEUED (Starts after Phase 1 complete)  
**Estimated Duration**: 3-4 days

---

## 🎯 Phase Goal

Deliver a pixel-perfect, accessible, and responsive user interface that makes EMI calculations intuitive and delightful for users in Lusaka.

---

## 📋 Features Overview

| Feature | Objective | Duration |
| --- | --- | --- |
| **2.1** | React Hook Form Integration | 1-2 days |
| **2.2** | Real-time Feedback & Error States | 1 day |
| **2.3** | Responsive Design | 1 day |
| **2.4** | WCAG 2.1 AA Compliance | 1 day |

---

## 🏗️ Feature 2.1: React Hook Form Integration

### Objective
Create an interactive form using React Hook Form with Zod validation integration.

### Requirements
- ✅ Form component: `Calculator.tsx` in `apps/web/src/pages/`
- ✅ Integrate React Hook Form with Zod resolver
- ✅ Input fields: Principal, Annual Rate, Tenure
- ✅ Display formatted EMI result
- ✅ Submit button with loading state
- ✅ Type-safe form handling

### Code Template
```typescript
// apps/web/src/pages/Calculator.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoanInputSchema, calculateEMI } from '@loan-calc/shared';

export const Calculator = () => {
  const form = useForm({
    resolver: zodResolver(LoanInputSchema),
    defaultValues: {
      principal: 100000,
      annualRate: 12,
      tenureMonths: 12,
    },
  });

  const onSubmit = (data) => {
    const emi = calculateEMI(data);
    // Display result
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('principal')} />
      <input {...form.register('annualRate')} />
      <input {...form.register('tenureMonths')} />
      <button type="submit">Calculate</button>
    </form>
  );
};
```

### Acceptance Criteria
- [ ] AC2.1.1: Form accepts three inputs (principal, rate, tenure)
- [ ] AC2.1.2: Zod validation integrated via resolver
- [ ] AC2.1.3: Form state managed with React Hook Form
- [ ] AC2.1.4: EMI calculated on submit
- [ ] AC2.1.5: Result displayed with 2 decimal places
- [ ] AC2.1.6: No TypeScript errors
- [ ] AC2.1.7: ESLint clean

---

## 🎨 Feature 2.2: Real-time Feedback & Error States

### Objective
Provide immediate visual feedback and clear error messaging to users.

### Requirements
- ✅ Real-time field validation errors
- ✅ Clear user-friendly error messages
- ✅ Input constraint feedback (e.g., "Interest rate cannot exceed 100%")
- ✅ Loading state during calculation
- ✅ Success confirmation display
- ✅ Field-level error styling

### Acceptance Criteria
- [ ] AC2.2.1: Validation errors appear in real-time
- [ ] AC2.2.2: Error messages are user-friendly
- [ ] AC2.2.3: Loading state shows during calculation
- [ ] AC2.2.4: Success message displays after calculation
- [ ] AC2.2.5: Error styling is clear and visible
- [ ] AC2.2.6: No console errors

---

## 📱 Feature 2.3: Responsive Design

### Objective
Ensure the calculator is 100% usable on mobile, tablet, and desktop devices.

### Requirements
- ✅ Mobile-first design approach
- ✅ Responsive layout using Tailwind CSS
- ✅ Touch-friendly input fields (min 44px height)
- ✅ Readable text on all screen sizes
- ✅ Form layout adapts to viewport
- ✅ Works on iOS and Android browsers

### Device Targets
- Mobile: 375px - 480px (iPhone 12 mini to SE)
- Tablet: 768px - 1024px (iPad)
- Desktop: 1024px+ (laptops)

### Acceptance Criteria
- [ ] AC2.3.1: Mobile layout tested and verified
- [ ] AC2.3.2: Tablet layout tested and verified
- [ ] AC2.3.3: Desktop layout tested and verified
- [ ] AC2.3.4: Touch targets ≥44px
- [ ] AC2.3.5: Text readable without zooming
- [ ] AC2.3.6: No horizontal scroll on any device

---

## ♿ Feature 2.4: WCAG 2.1 AA Compliance

### Objective
Ensure the interface meets accessibility standards for users with disabilities.

### Requirements
- ✅ ARIA labels on all form fields
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Focus management visible
- ✅ Screen reader compatible
- ✅ Color contrast ≥4.5:1
- ✅ Error messages associated with fields

### Acceptance Criteria
- [ ] AC2.4.1: All inputs have ARIA labels
- [ ] AC2.4.2: Keyboard navigation fully functional
- [ ] AC2.4.3: Focus indicators visible
- [ ] AC2.4.4: Screen reader testing passed
- [ ] AC2.4.5: Color contrast verified (WCAG AA)
- [ ] AC2.4.6: Axe accessibility audit: 0 violations
- [ ] AC2.4.7: Form fully navigable with keyboard only

---

## ✅ Phase 2 Global Acceptance Criteria

| AC | Requirement | Status |
| --- | --- | --- |
| **AC2.0.1** | All features (2.1-2.4) complete | ⏳ Pending |
| **AC2.0.2** | ESLint clean (`pnpm lint`) | ⏳ Pending |
| **AC2.0.3** | TypeScript clean (`pnpm typecheck`) | ⏳ Pending |
| **AC2.0.4** | ≥85% test coverage achieved | ⏳ Pending |
| **AC2.0.5** | All tests passing (`pnpm test`) | ⏳ Pending |
| **AC2.0.6** | Code review approved (2 reviewers) | ⏳ Pending |
| **AC2.0.7** | Accessibility audit: 0 violations | ⏳ Pending |
| **AC2.0.8** | Responsive design verified on 3+ devices | ⏳ Pending |

---

## 📊 Phase 2 Success Metrics

- **Coverage**: ≥85% (targeting 90%)
- **Performance**: <100ms E2E calculation
- **Accessibility**: WCAG 2.1 AA 100% compliant
- **Responsiveness**: Works flawlessly on all screen sizes
- **Keyboard Navigation**: 100% functional
- **User Satisfaction**: Forms are intuitive and error feedback is clear

---

## 🗓️ Phase 2 Timeline

| Day | Focus | Deliverable |
| --- | --- | --- |
| **Day 1** | Features 2.1 (Form) | PR submitted |
| **Day 2** | Features 2.2 (Feedback) | PR submitted |
| **Day 3** | Features 2.3-2.4 (Responsive + A11y) | PRs submitted |
| **Day 4** | Code review + refinements | All PRs merged |

---

## 🎯 Phase 2 Accountability

**By end of Phase 2:**
- ✅ UI component is pixel-perfect
- ✅ Form validation integrated with Phase 1 logic
- ✅ Mobile devices fully supported
- ✅ Accessibility standards met
- ✅ All feedback real-time and clear
- ✅ Code review approved

**Sign-Off**: Senior dev approves → Phase 3 authorization

---

