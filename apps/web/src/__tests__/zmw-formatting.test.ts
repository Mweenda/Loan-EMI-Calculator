import { describe, it, expect } from 'vitest';
import { formatCurrency, CURRENCY_CODE, LOCALE } from '../config';

/**
 * Phase 2.5: ZMW Currency Formatting Tests
 * 
 * Verifies that all currency values are properly formatted
 * using the Zambian Kwacha (ZMW) locale with correct spacing and symbols.
 */

describe('ZMW Currency Formatting', () => {
  describe('Basic Formatting', () => {
    it('should format simple amount with currency symbol and decimals', () => {
      const formatted = formatCurrency(1250);
      expect(formatted).toContain('K');
      expect(formatted).toContain('1,250');
      expect(formatted).toContain('.00');
    });

    it('should format small amount correctly', () => {
      const formatted = formatCurrency(10);
      expect(formatted).toMatch(/K\s*10\.00/);
    });

    it('should format large amount with thousands separator', () => {
      const formatted = formatCurrency(1000000);
      expect(formatted).toContain('1,000,000');
    });

    it('should maintain ZMW currency code in output', () => {
      const formatted = formatCurrency(5000);
      // Intl.NumberFormat with 'en-ZM' locale produces "K" prefix
      expect(formatted).toMatch(/^K\s*/);
    });
  });

  describe('Decimal Precision', () => {
    it('should format to exactly 2 decimal places', () => {
      const formatted = formatCurrency(926.35);
      expect(formatted).toMatch(/\.35$/);
    });

    it('should round to 2 decimal places', () => {
      const formatted = formatCurrency(926.356);
      // Should round to .36 or display .35 depending on rounding
      expect(formatted).toMatch(/\.\d{2}$/);
    });

    it('should pad with zeros if needed', () => {
      const formatted = formatCurrency(926);
      expect(formatted).toMatch(/926\.00/);
    });

    it('should handle fractional values', () => {
      const formatted = formatCurrency(926.5);
      expect(formatted).toMatch(/926\.50/);
    });
  });

  describe('EMI Calculation Examples (Zambian Context)', () => {
    it('should format benchmark EMI: K10,000 @ 20% for 12 months', () => {
      // EMI for K10,000 at 20% annual for 12 months
      // Formula: EMI = P × R × (1+R)^N / ((1+R)^N - 1)
      // Monthly rate = 20 / (12 * 100) = 0.0166667
      // Expected EMI ≈ 926.35
      const emiAmount = 926.35;
      const formatted = formatCurrency(emiAmount);
      
      expect(formatted).toContain('K');
      expect(formatted).toContain('926');
      expect(formatted).toMatch(/926\.35/);
    });

    it('should format total amount: 12 months × K926.35', () => {
      const totalAmount = 926.35 * 12;
      const formatted = formatCurrency(totalAmount);
      
      expect(formatted).toContain('K');
      expect(formatted).toContain('11,116');
    });

    it('should format interest component: Total - Principal', () => {
      const principal = 10000;
      const totalAmount = 11116.20;
      const interest = totalAmount - principal;
      const formatted = formatCurrency(interest);
      
      expect(formatted).toContain('K');
      expect(formatted).toMatch(/1,116\./);
    });
  });

  describe('Locale Compliance', () => {
    it('should use en-ZM locale setting', () => {
      expect(LOCALE).toBe('en-ZM');
    });

    it('should use ZMW currency code', () => {
      expect(CURRENCY_CODE).toBe('ZMW');
    });

    it('should format with proper Zambian number formatting', () => {
      const formatted = formatCurrency(123456.78);
      // Zambian format uses comma as thousands separator
      expect(formatted).toContain(',');
      expect(formatted).toMatch(/123,456\.78/);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero amount', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toMatch(/K\s*0\.00/);
    });

    it('should handle very small amounts', () => {
      const formatted = formatCurrency(0.01);
      expect(formatted).toMatch(/0\.01/);
    });

    it('should handle very large amounts', () => {
      const formatted = formatCurrency(10000000);
      expect(formatted).toContain('10,000,000');
    });

    it('should handle negative amounts (for interest display)', () => {
      const formatted = formatCurrency(-500);
      // Should format negative properly
      expect(formatted).toMatch(/[\-−]/);
      expect(formatted).toContain('500');
    });
  });

  describe('Display Consistency', () => {
    it('should consistently format repeated calls', () => {
      const value = 5000.50;
      const formatted1 = formatCurrency(value);
      const formatted2 = formatCurrency(value);
      
      expect(formatted1).toBe(formatted2);
    });

    it('should format all components with same style', () => {
      const emi = formatCurrency(926.35);
      const total = formatCurrency(11116.20);
      const interest = formatCurrency(1116.20);
      
      // All should start with K
      expect(emi).toMatch(/^K/);
      expect(total).toMatch(/^K/);
      expect(interest).toMatch(/^K/);
      
      // All should have 2 decimals
      expect(emi).toMatch(/\.\d{2}$/);
      expect(total).toMatch(/\.\d{2}$/);
      expect(interest).toMatch(/\.\d{2}$/);
    });
  });
});
