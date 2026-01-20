# 📋 PHASE 3 ROADMAP: Persistence & API Layer

**Version**: 1.0  
**Date**: January 20, 2026  
**Owner**: Senior Engineering Team  
**Status**: QUEUED (Starts after Phase 2 complete)  
**Estimated Duration**: 2-3 days

---

## 🎯 Phase Goal

Enable data persistence and create a backend integration layer for future analytics and scalability.

---

## 📋 Features Overview

| Feature | Objective | Duration |
| --- | --- | --- |
| **3.1** | tRPC Integration | 1 day |
| **3.2** | Firestore Seeding | 1 day |
| **3.3** | Loading & Error States | 1 day |

---

## 🔌 Feature 3.1: tRPC Integration

### Objective
Create a type-safe API layer using tRPC for calculation logging and future analytics.

### Requirements
- ✅ Setup tRPC router in `packages/api`
- ✅ Create `logCalculation` procedure (POST)
- ✅ Procedure input validation with Zod
- ✅ Save calculation data to backend
- ✅ Type-safe API from frontend
- ✅ Error handling and retries

### Procedure Spec
```typescript
// packages/api/router.ts
export const calculationRouter = router({
  logCalculation: publicProcedure
    .input(LoanInputSchema.extend({
      emiResult: z.number(),
      timestamp: z.date(),
    }))
    .mutation(async ({ input }) => {
      // Save to Firestore
      return { success: true, id: docId };
    }),
});
```

### Acceptance Criteria
- [ ] AC3.1.1: tRPC router created in packages/api
- [ ] AC3.1.2: logCalculation procedure implemented
- [ ] AC3.1.3: Input validated with Zod
- [ ] AC3.1.4: Frontend can call via tRPC client
- [ ] AC3.1.5: Error handling implemented
- [ ] AC3.1.6: No TypeScript errors
- [ ] AC3.1.7: ESLint clean

---

## 🔥 Feature 3.2: Firestore Seeding

### Objective
Create scripts to populate default loan types and demonstrate backend integration.

### Requirements
- ✅ Create default loan types in Firestore:
  - Personal Loan (10% interest, 60 months)
  - Solar Install Loan (8% interest, 120 months)
  - Business Loan (12% interest, 84 months)
- ✅ Seed script for local development
- ✅ Seed script for production
- ✅ Query default loan types from frontend

### Seed Data Structure
```typescript
{
  id: "personal-loan",
  name: "Personal Loan",
  defaultRate: 10,
  maxTenure: 60,
  minPrincipal: 50000,
  maxPrincipal: 1000000,
}
```

### Acceptance Criteria
- [ ] AC3.2.1: Firestore collections initialized
- [ ] AC3.2.2: Default loan types populated
- [ ] AC3.2.3: Seed script for development
- [ ] AC3.2.4: Seed script for production
- [ ] AC3.2.5: Frontend can query loan types
- [ ] AC3.2.6: Data displays in UI

---

## ⚙️ Feature 3.3: Loading & Error States

### Objective
Provide graceful handling of API calls with clear user feedback.

### Requirements
- ✅ Loading skeleton during API call
- ✅ Timeout handling (>5s show warning)
- ✅ Retry mechanism (max 3 retries)
- ✅ Clear error messages to user
- ✅ Fallback UI if API fails
- ✅ Offline mode detection

### Acceptance Criteria
- [ ] AC3.3.1: Loading state shows during API call
- [ ] AC3.3.2: Timeout warning after 5 seconds
- [ ] AC3.3.3: Retry mechanism works (max 3)
- [ ] AC3.3.4: Error messages are user-friendly
- [ ] AC3.3.5: Fallback UI displays if offline
- [ ] AC3.3.6: No unhandled promise rejections

---

## ✅ Phase 3 Global Acceptance Criteria

| AC | Requirement | Status |
| --- | --- | --- |
| **AC3.0.1** | All features (3.1-3.3) complete | ⏳ Pending |
| **AC3.0.2** | tRPC fully integrated | ⏳ Pending |
| **AC3.0.3** | Firestore seeded with data | ⏳ Pending |
| **AC3.0.4** | ≥85% API coverage | ⏳ Pending |
| **AC3.0.5** | All tests passing | ⏳ Pending |
| **AC3.0.6** | Error handling verified | ⏳ Pending |
| **AC3.0.7** | Offline fallback working | ⏳ Pending |

---

## 📊 Phase 3 Success Metrics

- **API Response Time**: <500ms average
- **Error Recovery**: 100% successful retries
- **Timeout Handling**: User warned at 5s
- **Offline Support**: Works without connectivity
- **Data Persistence**: All calculations logged

---

## 🗓️ Phase 3 Timeline

| Day | Focus | Deliverable |
| --- | --- | --- |
| **Day 1** | Feature 3.1 (tRPC) | PR submitted |
| **Day 2** | Feature 3.2 (Firestore) | PR submitted |
| **Day 3** | Feature 3.3 (Loading/Errors) | PR submitted |
| **Day 4** | Code review + integration | All PRs merged |

---

## 🎯 Phase 3 Accountability

**By end of Phase 3:**
- ✅ Backend integration complete
- ✅ Data persistence working
- ✅ Error handling robust
- ✅ Offline support functional
- ✅ Default loan types seeded
- ✅ All code reviewed and approved

**Sign-Off**: Senior dev approves → Phase 4 authorization

---

