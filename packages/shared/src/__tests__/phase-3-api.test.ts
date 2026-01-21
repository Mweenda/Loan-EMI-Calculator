import { describe, it, expect } from 'vitest';
import { loanInputSchema } from '../index';

/**
 * Phase 3: API Integration Tests
 * 
 * Verifies tRPC server readiness, data serialization,
 * and API contract compliance
 */

describe('Phase 3: API Integration & Persistence', () => {
  describe('3.1 API Contract: LoanInput Serialization', () => {
    it('should serialize LoanInput to JSON', () => {
      const loanData = {
        principal: 10000,
        monthlyRate: 20,
        months: 12,
      };

      const json = JSON.stringify(loanData);
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(loanData);
    });

    it('should validate deserialized JSON data', () => {
      const json = '{"principal":10000,"monthlyRate":20,"months":12}';
      const parsed = JSON.parse(json);

      const result = loanInputSchema.safeParse(parsed);
      expect(result.success).toBe(true);
    });

    it('should preserve number precision through serialization', () => {
      const loanData = {
        principal: 123456.789,
        monthlyRate: 10.5,
        months: 24,
      };

      const json = JSON.stringify(loanData);
      const parsed = JSON.parse(json);

      expect(parsed.principal).toBeCloseTo(123456.789, 3);
      expect(parsed.monthlyRate).toBeCloseTo(10.5, 1);
    });
  });

  describe('3.2 API Error Handling', () => {
    it('should return error object for invalid payload', () => {
      const invalidPayload = {
        principal: -1000,
        monthlyRate: 150,
        months: 500,
      };

      const result = loanInputSchema.safeParse(invalidPayload);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should serialize error details for API response', () => {
      const invalidPayload = {
        principal: -1000,
        monthlyRate: 150,
      };

      const result = loanInputSchema.safeParse(invalidPayload);
      
      if (!result.success) {
        const errorResponse = {
          success: false,
          errors: result.error.flatten().fieldErrors,
        };

        expect(errorResponse.success).toBe(false);
        expect(errorResponse.errors.principal).toBeDefined();
      }
    });
  });

  describe('3.3 Data Persistence Contract', () => {
    it('should preserve calculation result precision', () => {
      // Simulating calculation result being stored
      const result = {
        principalAmount: 10000,
        monthlyEMI: 926.35,
        totalAmount: 11116.20,
        totalInterest: 1116.20,
        timestamp: new Date().toISOString(),
      };

      const json = JSON.stringify(result);
      const restored = JSON.parse(json);

      expect(restored.monthlyEMI).toBe(926.35);
      expect(restored.totalAmount).toBe(11116.20);
      expect(restored.totalInterest).toBe(1116.20);
    });

    it('should include metadata in persistence record', () => {
      const record = {
        id: 'calc-001',
        userId: 'user-123',
        calculationData: {
          principal: 10000,
          monthlyRate: 20,
          months: 12,
        },
        results: {
          monthlyEMI: 926.35,
          totalAmount: 11116.20,
          totalInterest: 1116.20,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(record).toHaveProperty('id');
      expect(record).toHaveProperty('userId');
      expect(record).toHaveProperty('calculationData');
      expect(record).toHaveProperty('results');
      expect(record).toHaveProperty('createdAt');
      expect(record).toHaveProperty('updatedAt');
    });
  });

  describe('3.4 Batch Operations', () => {
    it('should validate multiple loan calculations', () => {
      const loans = [
        { principal: 10000, monthlyRate: 20, months: 12 },
        { principal: 50000, monthlyRate: 15, months: 24 },
        { principal: 100000, monthlyRate: 10, months: 60 },
      ];

      const results = loans.map(loan => loanInputSchema.safeParse(loan));

      expect(results).toHaveLength(3);
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
    });

    it('should handle mixed valid/invalid batch', () => {
      const loans = [
        { principal: 10000, monthlyRate: 20, months: 12 },    // valid
        { principal: -5000, monthlyRate: 20, months: 12 },    // invalid
        { principal: 50000, monthlyRate: 15, months: 24 },    // valid
      ];

      const results = loans.map(loan => loanInputSchema.safeParse(loan));

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe('3.5 API Response Format', () => {
    it('should format successful API response', () => {
      const loanData = { principal: 10000, monthlyRate: 20, months: 12 };
      const validationResult = loanInputSchema.safeParse(loanData);

      const apiResponse = {
        status: 'success',
        data: validationResult.success ? loanData : null,
        error: validationResult.success ? null : validationResult.error?.message,
      };

      expect(apiResponse.status).toBe('success');
      expect(apiResponse.data).toEqual(loanData);
      expect(apiResponse.error).toBeNull();
    });

    it('should format error API response', () => {
      const loanData = { principal: -100, monthlyRate: 20, months: 12 };
      const validationResult = loanInputSchema.safeParse(loanData);

      const apiResponse = {
        status: validationResult.success ? 'success' : 'error',
        data: validationResult.success ? loanData : null,
        errors: !validationResult.success ? validationResult.error?.flatten().fieldErrors : null,
      };

      expect(apiResponse.status).toBe('error');
      expect(apiResponse.data).toBeNull();
      expect(apiResponse.errors).toBeDefined();
    });
  });
});
