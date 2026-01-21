type StoredCalculation = {
  id: string;
  principal: number;
  monthlyRate: number;
  months: number;
  monthlyEMI: number;
  formattedMonthlyEMI: string;
  currency: string;
  version: string;
  userId?: string;
  requestId?: string;
  createdAt: string;
};

const store: StoredCalculation[] = [];

export const clearStore = () => {
  store.length = 0;
};

export const getStore = () => store;

export const saveCalculation = async (doc: Omit<StoredCalculation, 'id' | 'createdAt'>) => {
  const id = `inmem-${store.length + 1}`;
  const createdAt = new Date().toISOString();
  const record: StoredCalculation = { id, createdAt, ...doc } as StoredCalculation;
  store.push(record);
  return { id, record };
};
