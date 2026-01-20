/**
 * Application Configuration
 * Default values and constants for Zambian Kwacha (ZMW) locale
 */

export const DEFAULT_LOAN_VALUES = {
  principal: 100000,      // Default: K100,000 (ZMW)
  annualRate: 20,         // Default: 20% per annum (typical Zambian market rate)
  months: 12,             // Default: 12 months
} as const;

export const LOAN_CONSTRAINTS = {
  principal: {
    min: 1,
    max: 10000000,
    label: 'Principal Amount (ZMW)',
  },
  annualRate: {
    min: 0.1,
    max: 100,
    label: 'Annual Interest Rate (%)',
  },
  months: {
    min: 1,
    max: 360,
    label: 'Loan Tenure (Months)',
  },
} as const;

// Zambian Kwacha currency configuration
export const CURRENCY_SYMBOL = 'K';
export const CURRENCY_CODE = 'ZMW';
export const LOCALE = 'en-ZM';  // Zambian English locale
export const DECIMAL_PLACES = 2;

/**
 * Format currency value using Zambian Kwacha locale
 * @param value - Numeric value to format
 * @returns Formatted string (e.g., "K 1,250.00")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(value);
};

