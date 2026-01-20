import { z } from "zod";

// ============================================================================
// SCHEMA: Zod Runtime Validation
// ============================================================================
export const loanInputSchema = z.object({
  principal: z
    .coerce
    .number()
    .min(1, "Principal must be greater than or equal to 1")
    .max(10000000, "Principal must be less than or equal to 10,000,000"),
  
  annualRate: z
    .coerce
    .number()
    .min(0.1, "Annual rate must be greater than or equal to 0.1")
    .max(100, "Annual rate must be less than or equal to 100"),
  
  months: z
    .coerce
    .number()
    .int("Months must be a whole number")
    .min(1, "Months must be greater than or equal to 1")
    .max(360, "Months must be less than or equal to 360"),
});

export type LoanInput = z.infer<typeof loanInputSchema>;

// ============================================================================
// FUNCTION: EMI Calculation Engine
// ============================================================================
/**
 * Calculates Equated Monthly Installment (EMI) using the standard formula:
 * EMI = P × R × (1 + R)^N / ((1 + R)^N - 1)
 *
 * Where:
 * - P = Principal amount (loan amount)
 * - R = Monthly interest rate (annual rate / 12 / 100)
 * - N = Number of months (tenure)
 *
 * @param data - LoanInput object with principal, annualRate, and months
 * @returns Calculated EMI amount as a number (IEEE 754 precision)
 *
 * @example
 * const emi = calculateEMI({
 *   principal: 100000,
 *   annualRate: 12,
 *   months: 12,
 * });
 * // Returns: 8884.88
 */
export const calculateEMI = (data: LoanInput): number => {
  const { principal, annualRate, months } = data;

  // Calculate monthly interest rate (convert percentage to decimal)
  const monthlyRate = annualRate / (12 * 100);

  // Calculate (1 + R)^N
  const raisedToN = Math.pow(1 + monthlyRate, months);

  // Apply EMI formula
  const emi = (principal * monthlyRate * raisedToN) / (raisedToN - 1);

  return emi;
};
