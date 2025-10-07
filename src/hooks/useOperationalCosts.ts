import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { OperationalCost } from '@/types';

export function useOperationalCosts() {
  const costs = useLiveQuery(() => db.operationalCosts.orderBy('date').toArray(), []);

  const addCost = async (data: Omit<OperationalCost, 'id' | 'createdAt'>) => {
    await db.operationalCosts.add({
      ...data,
      createdAt: new Date().toISOString(),
    });
  };

  // ... (fungsi update & delete akan kita tambahkan nanti)

  return { costs: costs || [] };
}