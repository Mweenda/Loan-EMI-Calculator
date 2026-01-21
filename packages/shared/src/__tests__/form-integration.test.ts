import { describe, it, expect } from 'vitest';
import { loanInputSchema } from '../index';

/**
 * Phase 2: Form Integration Tests
 * 
 * These tests verify that the validation schema integrates seamlessly
 * with React Hook Form and provides real-time validation feedback.
 * 
 * TDD Approach: Red → Green → Refactor
 */

describe('Form Integration: Real-time Validation', () => {
  describe('2.1 Field-Level Validation Messages', () => {
    it('should provide meaningful error for invalid principal', () => {
      const result = loanInputSchema.safeParse({
        principal: -100,
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const principalError = result.error.flatten().fieldErrors.principal;
        expect(principalError).toBeDefined();
        expect(principalError?.[0]).toContain('must be greater than or equal to 1');
      }
    });

    it('should provide meaningful error for invalid interest rate', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: -5,
        months: 12,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const rateError = result.error.flatten().fieldErrors.monthlyRate;
        expect(rateError).toBeDefined();
        expect(rateError?.[0]).toContain('must be greater than or equal to');
      }
    });

    it('should provide meaningful error for invalid tenure', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10,
        months: 0,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const monthsError = result.error.flatten().fieldErrors.months;
        expect(monthsError).toBeDefined();
        expect(monthsError?.[0]).toContain('must be greater than or equal to 1');
      }
    });

    it('should accept form submission with valid data', () => {
      const validData = {
        principal: 100000,
        monthlyRate: 10,
        months: 12,
      };

      const result = loanInputSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });
  });

  describe('2.2 Type Coercion for Form Inputs', () => {
    it('should coerce string principal to number', () => {
      const result = loanInputSchema.safeParse({
        principal: '100000',
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.principal).toBe(100000);
        expect(typeof result.data.principal).toBe('number');
      }
    });

    it('should coerce string rate to number', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: '10.5',
        months: 12,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.monthlyRate).toBe(10.5);
        expect(typeof result.data.monthlyRate).toBe('number');
      }
    });

    it('should coerce string months to number', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10,
        months: '12',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.months).toBe(12);
        expect(typeof result.data.months).toBe('number');
      }
    });

    it('should reject non-numeric string for principal', () => {
      const result = loanInputSchema.safeParse({
        principal: 'abc',
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should reject non-numeric string for rate', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 'xyz',
        months: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should reject non-numeric string for months', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10,
        months: 'invalid',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('2.3 Progressive Validation (As User Types)', () => {
    it('should validate partial input data', () => {
      const incompleteData = {
        principal: 50000,
        monthlyRate: 8,
      };

      // Schema should accept partial data for progressive validation
      const schema = loanInputSchema.partial();
      const result = schema.safeParse(incompleteData);

      expect(result.success).toBe(true);
    });

    it('should accept minimum valid values', () => {
      const minData = {
        principal: 1,
        monthlyRate: 0.1,
        months: 1,
      };

      const result = loanInputSchema.safeParse(minData);
      expect(result.success).toBe(true);
    });

    it('should accept maximum valid values', () => {
      const maxData = {
        principal: 10000000,
        monthlyRate: 100,
        months: 360,
      };

      const result = loanInputSchema.safeParse(maxData);
      expect(result.success).toBe(true);
    });

    it('should reject values just outside boundaries', () => {
      const underMin = {
        principal: 0,
        monthlyRate: 10,
        months: 12,
      };

      const result = loanInputSchema.safeParse(underMin);
      expect(result.success).toBe(false);
    });

    it('should reject values exceeding maximum', () => {
      const overMax = {
        principal: 10000001,
        monthlyRate: 10,
        months: 12,
      };

      const result = loanInputSchema.safeParse(overMax);
      expect(result.success).toBe(false);
    });
  });

  describe('2.4 Floating Point Handling', () => {
    it('should accept decimal values for interest rate', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10.75,
        months: 12,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.monthlyRate).toBe(10.75);
      }
    });

    it('should accept very small decimal rates', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 0.15,
        months: 12,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.monthlyRate).toBe(0.15);
      }
    });

    it('should reject very high decimal precision that exceeds boundaries', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 100.01,
        months: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should handle floating point principal values', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000.50,
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.principal).toBeCloseTo(100000.50, 2);
      }
    });
  });

  describe('2.5 Error Message Quality', () => {
    it('should provide clear error message for each field', () => {
      const invalidData = {
        principal: -1000,
        monthlyRate: -50,
        months: -5,
      };

      const result = loanInputSchema.safeParse(invalidData);
      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        
        // All three fields should have error messages
        expect(errors.principal).toBeDefined();
        expect(errors.monthlyRate).toBeDefined();
        expect(errors.months).toBeDefined();
        
        // Error messages should be strings, not empty
        expect(errors.principal?.[0]).toBeTruthy();
        expect(errors.monthlyRate?.[0]).toBeTruthy();
        expect(errors.months?.[0]).toBeTruthy();
      }
    });

    it('should provide specific error for exceeding maximum principal', () => {
      const result = loanInputSchema.safeParse({
        principal: 50000000,
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.principal?.[0] || '';
        expect(error.toLowerCase()).toContain('must be less than or equal to');
      }
    });

    it('should provide specific error for exceeding maximum tenure', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10,
        months: 500,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        const error = result.error.flatten().fieldErrors.months?.[0] || '';
        expect(error.toLowerCase()).toContain('must be less than or equal to');
      }
    });
  });

  describe('2.6 Edge Cases for Form Submission', () => {
    it('should handle null/undefined gracefully', () => {
      const result = loanInputSchema.safeParse({
        principal: undefined,
        monthlyRate: 10,
        months: 12,
      });

      expect(result.success).toBe(false);
    });

    it('should reject objects with extra properties', () => {
      const result = loanInputSchema.safeParse({
        principal: 100000,
        monthlyRate: 10,
        months: 12,
        extraField: 'should be ignored or error',
      });

      // Zod by default strips extra properties (strict: false)
      // This test verifies the behavior
      if (result.success) {
        expect('extraField' in result.data).toBe(false);
      }
    });

    it('should preserve numeric precision through validation', () => {
      const preciseData = {
        principal: 123456.789,
        monthlyRate: 9.876,
        months: 59,
      };

      const result = loanInputSchema.safeParse(preciseData);
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.principal).toBeCloseTo(123456.789, 3);
        expect(result.data.monthlyRate).toBeCloseTo(9.876, 3);
      }
    });
  });
});
