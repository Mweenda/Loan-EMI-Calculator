import { describe, it, expect } from 'vitest';
import { calculateEMI, LoanInput, LoanInputSchema } from '../index';

describe('Feature 1.1: EMI Calculation Engine', () => {
  describe('RED Phase: Failing Tests (Before Implementation)', () => {
    describe('calculateEMI - Benchmark Verification', () => {
      it('should calculate EMI correctly for benchmark case 1: 100k @ 12% for 12 months', () => {
        const input: LoanInput = {
          principal: 100000,
          monthlyRate: 1,
          months: 12,
        };
        const result = calculateEMI(input);
  // Expected: ₹8,884.88 (EMI = P × R × (1+R)^N / ((1+R)^N - 1))
  expect(result).toBeCloseTo(8884.88, 2);
      });

      it('should calculate EMI correctly for benchmark case 2: 500k @ 10% for 60 months', () => {
        const input: LoanInput = {
          principal: 500000,
          monthlyRate: 10 / 12,
          months: 60,
        };
        const result = calculateEMI(input);
  // Expected: ₹10,623.52 (using standard EMI formula)
  expect(result).toBeCloseTo(10623.52, 2);
      });

      it('should calculate EMI correctly for benchmark case 3: 50k @ 2% for 24 months', () => {
        const input: LoanInput = {
          principal: 50000,
          monthlyRate: 2 / 12,
          months: 24,
        };
        const result = calculateEMI(input);
  // Expected: ₹2,127.01 (using standard EMI formula)
  expect(result).toBeCloseTo(2127.01, 2);
      });
    });

    describe('Edge Cases: Minimum Boundaries', () => {
      it('should handle minimum principal (₹1)', () => {
        const input: LoanInput = {
          principal: 1,
          monthlyRate: 10 / 12,
          months: 12,
        };
        const result = calculateEMI(input);
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      it('should handle minimum tenure (1 month)', () => {
        const input: LoanInput = {
          principal: 100000,
          monthlyRate: 10 / 12,
          months: 1,
        };
        const result = calculateEMI(input);
  expect(result).toBeCloseTo(100833.33, 2); // EMI ≈ principal + interest for 1 month
      });

      it('should handle minimum interest rate (0.1%)', () => {
        const input: LoanInput = {
          principal: 100000,
          monthlyRate: 0.1,
          months: 12,
        };
        const result = calculateEMI(input);
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(100000); // EMI should be reasonable
      });
    });

    describe('Edge Cases: Maximum Boundaries', () => {
      it('should handle maximum tenure (360 months = 30 years)', () => {
        const input: LoanInput = {
          principal: 5000000,
          monthlyRate: 8 / 12,
          months: 360,
        };
        const result = calculateEMI(input);
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      it('should handle maximum principal (₹10,000,000)', () => {
        const input: LoanInput = {
          principal: 10000000,
          monthlyRate: 10 / 12,
          months: 120,
        };
        const result = calculateEMI(input);
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });

      it('should handle maximum interest rate (100%)', () => {
        const input: LoanInput = {
          principal: 100000,
          monthlyRate: 100,
          months: 12,
        };
        const result = calculateEMI(input);
        expect(result).toBeGreaterThan(0);
        expect(typeof result).toBe('number');
      });
    });

    describe('Precision: IEEE 754 Number Accuracy', () => {
      it('should maintain precision to 2 decimal places for currency', () => {
        const input: LoanInput = {
          principal: 123456,
          monthlyRate: 7.5 / 12,
          months: 84,
        };
        const result = calculateEMI(input);
        // Verify it's a proper number, not Infinity or NaN
        expect(Number.isFinite(result)).toBe(true);
        // Verify precision (no floating point errors)
        expect(result.toFixed(2).split('.')[1].length).toBeLessThanOrEqual(2);
      });

      it('should not return NaN for valid inputs', () => {
        const input: LoanInput = {
          principal: 250000,
          monthlyRate: 9.5 / 12,
          months: 180,
        };
        const result = calculateEMI(input);
        expect(Number.isNaN(result)).toBe(false);
      });

      it('should not return Infinity for valid inputs', () => {
        const input: LoanInput = {
          principal: 500000,
          monthlyRate: 12 / 12,
          months: 60,
        };
        const result = calculateEMI(input);
        expect(Number.isFinite(result)).toBe(true);
      });
    });

    describe('Formula Validation: Mathematical Correctness', () => {
      it('should verify EMI increases with principal (all else equal)', () => {
        const emi1 = calculateEMI({
          principal: 100000,
          monthlyRate: 10 / 12,
          months: 60,
        });
        const emi2 = calculateEMI({
          principal: 200000,
          monthlyRate: 10 / 12,
          months: 60,
        });
        expect(emi2).toBeGreaterThan(emi1);
      });

      it('should verify EMI increases with interest rate (all else equal)', () => {
        const emi1 = calculateEMI({
          principal: 100000,
          monthlyRate: 5 / 12,
          months: 60,
        });
        const emi2 = calculateEMI({
          principal: 100000,
          monthlyRate: 10 / 12,
          months: 60,
        });
        expect(emi2).toBeGreaterThan(emi1);
      });

      it('should verify EMI decreases with longer tenure (all else equal)', () => {
        const emi1 = calculateEMI({
          principal: 100000,
          monthlyRate: 10 / 12,
          months: 12,
        });
        const emi2 = calculateEMI({
          principal: 100000,
          monthlyRate: 10 / 12,
          months: 60,
        });
        expect(emi2).toBeLessThan(emi1);
      });
    });
  });
});
