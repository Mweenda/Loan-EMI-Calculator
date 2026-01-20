/**
 * Application Configuration
 * Default values and constants
 */

export const DEFAULT_LOAN_VALUES = {
  principal: 100000,      // Default: ₹100,000
  annualRate: 10,         // Default: 10% per annum
  months: 12,             // Default: 12 months
} as const;

export const LOAN_CONSTRAINTS = {
  principal: {
    min: 1,
    max: 10000000,
    label: 'Principal Amount (₹)',
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

export const CURRENCY_SYMBOL = '₹';
export const DECIMAL_PLACES = 2;
