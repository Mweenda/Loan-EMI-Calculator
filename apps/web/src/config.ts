/**
 * Application Configuration
 * Default values and constants for Zambian Kwacha (ZMW) locale
 */

export const DEFAULT_LOAN_VALUES = {
  principal: 10000,       // Default: K10,000 (ZMW) - typical SME loan
  monthlyRate: 2,         // Default: 2% per month
  months: 12,             // Default: 12 months
} as const;

export const LOAN_CONSTRAINTS = {
  principal: {
    min: 1,
    max: 10000000,
    label: 'Principal Amount (ZMW)',
  },
  monthlyRate: {
    min: 0.1,
    max: 100,
    label: 'Monthly Interest Rate (%)',
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
  // Intl.NumberFormat may insert a non-breaking space (\u00A0) between
  // currency symbol and value; normalize to a regular space so tests
  // that match "K 1,234.56" succeed.
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    minimumFractionDigits: DECIMAL_PLACES,
    maximumFractionDigits: DECIMAL_PLACES,
  }).format(value);

  return formatted.replace(/\u00A0/g, ' ');
};

