import { z } from "zod";
// ============================================================================
// SCHEMA: Zod Runtime Validation
// ============================================================================
export const loanInputSchema = z.object({
    principal: z.number().positive("Principal must be greater than 0"), // Loan amount in currency units
    annualRate: z.number().positive("Annual rate must be greater than 0"), // Annual interest rate (percent)
    months: z.number().int().positive("Months must be a positive integer"), // Loan tenure in months
});
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
export const calculateEMI = (data) => {
    const { principal, annualRate, months } = data;
    // Calculate monthly interest rate (convert percentage to decimal)
    const monthlyRate = annualRate / (12 * 100);
    // Calculate (1 + R)^N
    const raisedToN = Math.pow(1 + monthlyRate, months);
    // Apply EMI formula
    const emi = (principal * monthlyRate * raisedToN) / (raisedToN - 1);
    return emi;
};
//# sourceMappingURL=index.js.map