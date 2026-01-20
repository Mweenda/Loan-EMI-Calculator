import { z } from "zod";

export const loanInputSchema = z.object({
  principal: z.number().positive(), // Loan amount
  annualRate: z.number().positive(), // Annual interest rate (percent)
  months: z.number().int().positive(), // Loan tenure in months
});

export type LoanInput = z.infer<typeof loanInputSchema>;
