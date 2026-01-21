import { z } from 'zod';
import { loanInputSchema } from '../../../packages/shared/src';
import { saveCalculation as saveInMemory, clearStore } from './inMemoryAdapter';
import { saveCalculation as saveToFirestore } from './firestoreAdapter';

const adapter = process.env.API_ADAPTER === 'firestore' ? 'firestore' : 'inmemory';

export const logCalculation = async (payload: {
  principal: number;
  monthlyRate: number;
  months: number;
  monthlyEMI: number;
  formattedMonthlyEMI: string;
  currency: 'ZMW' | string;
  userId?: string;
  requestId?: string;
  version?: string;
}) => {
  // Server-side validation reuse: validate loan inputs first
  const validated = loanInputSchema.parse({
    principal: payload.principal,
    monthlyRate: payload.monthlyRate,
    months: payload.months,
  });

  // Additional payload validation
  const fullSchema = z.object({
    monthlyEMI: z.number(),
    formattedMonthlyEMI: z.string(),
    currency: z.literal('ZMW'),
    userId: z.string().optional(),
    requestId: z.string().optional(),
    version: z.string().optional(),
  });

  const extra = fullSchema.parse({
    monthlyEMI: payload.monthlyEMI,
    formattedMonthlyEMI: payload.formattedMonthlyEMI,
    currency: payload.currency,
    userId: payload.userId,
    requestId: payload.requestId,
    version: payload.version ?? 'emi-v1',
  });

  // Persist via configured adapter
  const persistPayload = {
    principal: validated.principal,
    monthlyRate: validated.monthlyRate,
    months: validated.months,
    monthlyEMI: extra.monthlyEMI,
    formattedMonthlyEMI: extra.formattedMonthlyEMI,
    currency: extra.currency,
    version: extra.version ?? 'emi-v1',
    userId: extra.userId,
    requestId: extra.requestId,
  };

  const { id } =
    adapter === 'firestore'
      ? await saveToFirestore(persistPayload)
      : await saveInMemory(persistPayload as any);

  return { success: true, id };
};

export default { logCalculation };
