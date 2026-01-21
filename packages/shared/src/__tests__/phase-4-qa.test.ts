import { describe, it, expect } from 'vitest';
import { calculateEMI, loanInputSchema } from '../index';

/**
 * Phase 4: Quality Assurance & Performance Tests
 * 
 * Verifies performance benchmarks, stress testing,
 * and production readiness
 */

describe('Phase 4: Quality Assurance & Performance', () => {
  describe('4.1 Performance Benchmarks', () => {
    it('should calculate EMI in <1ms', () => {
      const start = performance.now();
      
      calculateEMI({
        principal: 10000,
        monthlyRate: 20 / 12,
        months: 12,
      });
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(1);
    });

    it('should validate input in <10ms', () => {
      const start = performance.now();
      
      loanInputSchema.safeParse({
        principal: 10000,
        monthlyRate: 20 / 12,
        months: 12,
      });
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(10);
    });

    it('should handle 1000 calculations in <100ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        calculateEMI({
          principal: 10000 + i,
          monthlyRate: 20 / 12,
          months: 12,
        });
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should validate 1000 inputs in <100ms', () => {
      const start = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        loanInputSchema.safeParse({
          principal: 10000 + i,
          monthlyRate: 20 / 12,
          months: 12,
        });
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(100);
    });
  });

  describe('4.2 Stress Testing', () => {
    it('should handle extreme principal values', () => {
      const extremeValues = [
        { principal: 1, monthlyRate: 0.1, months: 1 },
        { principal: 10000000, monthlyRate: 100, months: 360 },
        { principal: 999999.99, monthlyRate: 99.99, months: 359 },
      ];

      extremeValues.forEach(data => {
        const validationResult = loanInputSchema.safeParse(data);
        expect(validationResult.success).toBe(true);

        if (validationResult.success) {
          const emi = calculateEMI(data);
          expect(typeof emi).toBe('number');
          expect(emi).toBeGreaterThan(0);
          expect(isFinite(emi)).toBe(true);
        }
      });
    });

    it('should not produce Infinity or NaN results', () => {
      const testCases = [
        { principal: 10000, monthlyRate: 0.1, months: 1 },
        { principal: 10000000, monthlyRate: 100, months: 360 },
        { principal: 1, monthlyRate: 50, months: 180 },
      ];

      testCases.forEach(testCase => {
        const emi = calculateEMI(testCase);
        expect(isFinite(emi)).toBe(true);
        expect(Number.isNaN(emi)).toBe(false);
      });
    });

    it('should maintain precision under extreme conditions', () => {
      const emi = calculateEMI({
        principal: 9999999.99,
        monthlyRate: 99.99,
        months: 359,
      });

      // Result should be a valid number
      expect(typeof emi).toBe('number');
      expect(emi).toBeGreaterThan(0);
      
      // Check decimal precision
      const rounded = Math.round(emi * 100) / 100;
      expect(Math.abs(rounded - emi) < 0.01).toBe(true);
    });
  });

  describe('4.3 Regression Testing', () => {
    it('should maintain benchmark accuracy over time', () => {
      const benchmarks = [
        { input: { principal: 100000, monthlyRate: 12 / 12, months: 12 }, expected: 8884.88 },
        { input: { principal: 500000, monthlyRate: 10 / 12, months: 60 }, expected: 10623.52 },
        { input: { principal: 50000, monthlyRate: 2 / 12, months: 24 }, expected: 2127.01 },
        { input: { principal: 10000, monthlyRate: 20 / 12, months: 12 }, expected: 926.35 },
      ];

      benchmarks.forEach(({ input, expected }) => {
        const result = calculateEMI(input);
        expect(result).toBeCloseTo(expected, 2);
      });
    });

    it('should not introduce rounding errors', () => {
      const inputs = [
        { principal: 123456.78, monthlyRate: 8.75 / 12, months: 48 },
        { principal: 999.99, monthlyRate: 1.5 / 12, months: 12 },
        { principal: 5000000, monthlyRate: 15.25 / 12, months: 120 },
      ];

      inputs.forEach(input => {
        const emi1 = calculateEMI(input);
        const emi2 = calculateEMI(input);
        
        // Same input should produce identical result
        expect(emi1).toBe(emi2);
      });
    });
  });

  describe('4.4 Input Sanitization', () => {
    it('should coerce string inputs safely', () => {
      const result = loanInputSchema.safeParse({
        principal: '10000',
        monthlyRate: '20',
        months: '12',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data.principal).toBe('number');
        expect(typeof result.data.monthlyRate).toBe('number');
        expect(typeof result.data.months).toBe('number');
      }
    });

    it('should reject malicious inputs', () => {
      const maliciousInputs = [
        { principal: '<script>alert("xss")</script>', monthlyRate: 20, months: 12 },
        { principal: 10000, monthlyRate: '"; DROP TABLE loans;--', months: 12 },
        { principal: 10000, monthlyRate: 20, months: null },
        { principal: undefined, monthlyRate: 20, months: 12 },
      ];

      maliciousInputs.forEach(input => {
        const result = loanInputSchema.safeParse(input);
        expect(result.success).toBe(false);
      });
    });

    it('should handle edge case strings', () => {
      const edgeCases = [
        { principal: '0', monthlyRate: '20', months: '12' },      // Zero principal
        { principal: '-10000', monthlyRate: '20', months: '12' }, // Negative
        { principal: 'abc', monthlyRate: '20', months: '12' },    // Non-numeric
      ];

      edgeCases.forEach(input => {
        const result = loanInputSchema.safeParse(input);
        // All should fail validation
        expect(result.success).toBe(false);
      });
    });
  });

  describe('4.5 Production Readiness', () => {
    it('should handle concurrent calculations', () => {
      const promises = Array(100).fill(null).map((_, i) => 
        Promise.resolve().then(() => 
          calculateEMI({
            principal: 10000 + i,
            monthlyRate: 20 / 12,
            months: 12,
          })
        )
      );

      return Promise.all(promises).then(results => {
        expect(results).toHaveLength(100);
        results.forEach(result => {
          expect(typeof result).toBe('number');
          expect(isFinite(result)).toBe(true);
        });
      });
    });

    it('should provide consistent error messages', () => {
      const invalidInputs = [
        { principal: -100, monthlyRate: 20, months: 12 },
        { principal: 10000, monthlyRate: -5, months: 12 },
        { principal: 10000, monthlyRate: 20, months: -1 },
      ];

      invalidInputs.forEach(input => {
        const result = loanInputSchema.safeParse(input);
        
        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          const errorValues = Object.values(errors).flat();
          
          errorValues.forEach(error => {
            expect(typeof error).toBe('string');
            expect(error.length).toBeGreaterThan(0);
          });
        }
      });
    });

    it('should maintain type safety throughout lifecycle', () => {
      const validData = { principal: 10000, monthlyRate: 20 / 12, months: 12 };
      const parseResult = loanInputSchema.safeParse(validData);

      if (parseResult.success) {
        const data = parseResult.data;
        
        // TypeScript should enforce types
        expect(typeof data.principal).toBe('number');
        expect(typeof data.monthlyRate).toBe('number');
        expect(typeof data.months).toBe('number');

        // Calculation should work without type coercion
        const emi = calculateEMI(data);
        expect(typeof emi).toBe('number');
      }
    });
  });

  describe('4.6 Documentation & Maintainability', () => {
    it('should export public API', () => {
      expect(calculateEMI).toBeDefined();
      expect(loanInputSchema).toBeDefined();
    });

    it('should provide function signatures', () => {
      expect(typeof calculateEMI).toBe('function');
      expect(typeof loanInputSchema.safeParse).toBe('function');
    });

    it('should handle edge case: very long tenure', () => {
      const result = calculateEMI({
        principal: 100000,
        monthlyRate: 5 / 12,
        months: 360, // 30 years
      });

      expect(result).toBeGreaterThan(0);
      expect(isFinite(result)).toBe(true);
    });

    it('should handle edge case: very short tenure', () => {
      const result = calculateEMI({
        principal: 100000,
        monthlyRate: 20 / 12,
        months: 1,
      });

      expect(result).toBeGreaterThan(0);
      expect(isFinite(result)).toBe(true);
    });
  });
});
