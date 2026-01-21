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
    monthlyRate: z
        .coerce
        .number()
        .min(0.1, "Monthly rate must be greater than or equal to 0.1")
        .max(100, "Monthly rate must be less than or equal to 100"),
    months: z
        .coerce
        .number()
        .int("Months must be a whole number")
        .min(1, "Months must be greater than or equal to 1")
        .max(360, "Months must be less than or equal to 360"),
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
 * - R = Monthly interest rate (monthly rate / 100)
 * - N = Number of months (tenure)
 *
 * @param data - LoanInput object with principal, monthlyRate, and months
 * @returns Calculated EMI amount as a number (IEEE 754 precision)
 *
 * @example
 * const emi = calculateEMI({
 *   principal: 100000,
 *   monthlyRate: 12,
 *   months: 12,
 * });
 * // Returns: 8884.88
 */
export const calculateEMI = (data) => {
    const { principal, monthlyRate, months } = data;
    const monthlyDecimalRate = monthlyRate / 100;
    if (Math.abs(monthlyDecimalRate) < Number.EPSILON) {
        return principal / months;
    }
    const raisedToN = Math.pow(1 + monthlyDecimalRate, months);
    const denominator = raisedToN - 1;
    if (Math.abs(denominator) < Number.EPSILON) {
        return principal / months;
    }
    const emi = (principal * monthlyDecimalRate * raisedToN) / denominator;
    return emi;
};
//# sourceMappingURL=index.js.map