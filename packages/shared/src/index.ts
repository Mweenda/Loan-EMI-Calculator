import { z } from "zod";

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

export type LoanInput = z.infer<typeof loanInputSchema>;

export const calculateEMI = (data: LoanInput): number => {
  const { principal, monthlyRate, months } = data;

  const monthlyDecimalRate = monthlyRate / 100;

  // Handle zero-interest safely
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

