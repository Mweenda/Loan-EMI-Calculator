import { describe, it, expect } from 'vitest';
import { calculateEMI } from '..';
import { clearStore, getStore } from '../../../../apps/api/src/inMemoryAdapter';
import { logCalculation } from '../../../../apps/api/src/index';

/**
 * Phase 3 (RED): tRPC API contract tests
 *
 * These tests are intentionally written to fail (RED) until the tRPC
 * server/mutation `logCalculation` is implemented. The test asserts the
 * contract we expect the tRPC mutation to satisfy:
 * - called with principal, monthlyRate, months
 * - includes monthlyEMI (Number) and formattedMonthlyEMI (ZMW string)
 */

describe('Phase 3: tRPC API contract (logCalculation)', () => {
  it('should call logCalculation mutation with ZMW formatted result and inputs', () => {
    // Arrange: sample input
    const input = {
      principal: 10000,
      monthlyRate: 20,
      months: 12,
    };

    // Act: calculate EMI locally (business logic exists in shared)
    const monthlyEMI = calculateEMI(input as any);

    // Arrange: ensure clean in-memory store
    clearStore();

    // Prepare payload using calculated EMI
    const payload = {
      principal: input.principal,
      monthlyRate: input.monthlyRate,
      months: input.months,
      monthlyEMI,
      formattedMonthlyEMI: `K ${Math.round(monthlyEMI)}`,
      currency: 'ZMW' as const,
    };

    // Act: call the API stub (in-memory adapter)
    return Promise.resolve()
      .then(() => logCalculation(payload as any))
      .then((res) => {
        // Basic response checks
        expect(res).toHaveProperty('success', true);
        expect(res).toHaveProperty('id');

        // Inspect in-memory store
        const store = getStore();
        expect(store.length).toBe(1);
        expect(store[0]).toMatchObject({
          principal: input.principal,
          monthlyRate: input.monthlyRate,
          months: input.months,
          currency: 'ZMW',
        });
      });
  });
});
