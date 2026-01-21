// Lazy runtime import of firebase-admin; avoid compile-time type dependency
let db: any = null;

const initFirestore = (): any => {
  if (db) return db;

  // Lazy-load firebase-admin to avoid importing it when not needed (in-memory runs)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const admin = require('firebase-admin');

  // If a base64-encoded service account is provided, decode it and initialize
  const saBase64 = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (saBase64 && !process.env.FIRESTORE_EMULATOR_HOST) {
    const saJson = JSON.parse(Buffer.from(saBase64, 'base64').toString('utf8'));
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(saJson),
      });
    }
  } else {
    // If using emulator, initialize default app (no creds needed)
    if (!admin.apps.length) {
      admin.initializeApp();
    }
  }

  db = admin.firestore();

  // If FIRESTORE_EMULATOR_HOST is set, the SDK will route to the emulator automatically.
  return db;
};

export const saveCalculation = async (doc: {
  principal: number;
  monthlyRate: number;
  months: number;
  monthlyEMI: number;
  formattedMonthlyEMI: string;
  currency: string;
  version?: string;
  userId?: string;
  requestId?: string;
}) => {
  const firestore = initFirestore();
  const collection = firestore.collection('calculations');

  // If requestId is provided, use it as the document id for idempotency
  if (doc.requestId) {
    const ref = collection.doc(doc.requestId);
    const now = firestore.FieldValue.serverTimestamp();
    await ref.set(
      {
        principal: doc.principal,
        monthlyRate: doc.monthlyRate,
        months: doc.months,
        monthlyEMI: doc.monthlyEMI,
        formattedMonthlyEMI: doc.formattedMonthlyEMI,
        currency: doc.currency,
        version: doc.version ?? 'emi-v1',
        userId: doc.userId,
        requestId: doc.requestId,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
    return { id: ref.id };
  }

  // Otherwise add a new document
  const ref = await collection.add({
    principal: doc.principal,
    monthlyRate: doc.monthlyRate,
    months: doc.months,
    monthlyEMI: doc.monthlyEMI,
    formattedMonthlyEMI: doc.formattedMonthlyEMI,
    currency: doc.currency,
    version: doc.version ?? 'emi-v1',
    userId: doc.userId,
    requestId: doc.requestId ?? null,
    createdAt: require('firebase-admin').firestore.FieldValue.serverTimestamp(),
    updatedAt: require('firebase-admin').firestore.FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
};

export const seedLoanTemplates = async (templates: Array<{ id: string; name: string; description?: string; terms?: any }>) => {
  const firestore = initFirestore();
  const col = firestore.collection('loanTemplates');
  const results: Array<{ id: string; action: 'CREATED' | 'UPDATED' }> = [];

  for (const t of templates) {
    const ref = col.doc(t.id);
    const before = await ref.get();
    const existed = before && before.exists;
    // idempotent set with merge
    await ref.set({ name: t.name, description: t.description ?? null, terms: t.terms ?? null }, { merge: true });
    const action = existed ? 'UPDATED' : 'CREATED';
    results.push({ id: t.id, action });
  }
  return results;
};
