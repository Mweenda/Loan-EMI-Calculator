import { z } from "zod";
export declare const loanInputSchema: z.ZodObject<{
    principal: z.ZodNumber;
    monthlyRate: z.ZodNumber;
    months: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    principal: number;
    monthlyRate: number;
    months: number;
}, {
    principal: number;
    monthlyRate: number;
    months: number;
}>;
export type LoanInput = z.infer<typeof loanInputSchema>;
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
export declare const calculateEMI: (data: LoanInput) => number;
//# sourceMappingURL=index.d.ts.map