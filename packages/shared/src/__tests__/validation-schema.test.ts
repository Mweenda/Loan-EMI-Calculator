import { describe, it, expect } from 'vitest';
import { loanInputSchema, LoanInput } from '../index';

describe('Feature 1.2: Zod Validation Schema', () => {
  describe('RED Phase: Boundary Validation Tests', () => {
    describe('Principal Validation', () => {
      it('should reject zero principal', () => {
        const result = loanInputSchema.safeParse({
          principal: 0,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative principal', () => {
        const result = loanInputSchema.safeParse({
          principal: -50000,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should accept valid positive principal', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(true);
      });

      it('should accept minimum principal (₹1)', () => {
        const result = loanInputSchema.safeParse({
          principal: 1,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(true);
      });

      it('should accept maximum principal (₹10,000,000)', () => {
        const result = loanInputSchema.safeParse({
          principal: 10000000,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('Annual Rate Validation', () => {
      it('should reject zero interest rate', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 0,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative interest rate', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: -5,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should accept valid interest rate', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(true);
      });

      it('should accept minimum interest rate (0.1%)', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 0.1,
          months: 12,
        });
        expect(result.success).toBe(true);
      });

      it('should accept maximum interest rate (100%)', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 100,
          months: 12,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('Months (Tenure) Validation', () => {
      it('should reject zero months', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 0,
        });
        expect(result.success).toBe(false);
      });

      it('should reject negative months', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: -12,
        });
        expect(result.success).toBe(false);
      });

      it('should reject non-integer months (decimal)', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 12.5,
        });
        expect(result.success).toBe(false);
      });

      it('should accept valid integer months', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(true);
      });

      it('should accept minimum tenure (1 month)', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 1,
        });
        expect(result.success).toBe(true);
      });

      it('should accept maximum tenure (360 months)', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 360,
        });
        expect(result.success).toBe(true);
      });
    });

    describe('Type Coercion & Validation', () => {
      it('should reject missing principal field', () => {
        const result = loanInputSchema.safeParse({
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing annual rate field', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should reject missing months field', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
        });
        expect(result.success).toBe(false);
      });

      it('should reject string principal (no coercion)', () => {
        const result = loanInputSchema.safeParse({
          principal: '100000',
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(false);
      });

      it('should accept valid complete object', () => {
        const result = loanInputSchema.safeParse({
          principal: 250000,
          annualRate: 8.5,
          months: 84,
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({
            principal: 250000,
            annualRate: 8.5,
            months: 84,
          });
        }
      });
    });

    describe('Error Message Quality', () => {
      it('should provide clear error message for negative principal', () => {
        const result = loanInputSchema.safeParse({
          principal: -100,
          annualRate: 10,
          months: 12,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBeDefined();
        }
      });

      it('should provide error for non-integer months', () => {
        const result = loanInputSchema.safeParse({
          principal: 100000,
          annualRate: 10,
          months: 12.7,
        });
        expect(result.success).toBe(false);
      });
    });
  });
});
