import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { OperationalCost } from '@/types';

export function useOperationalCosts() {
  const costs = useLiveQuery(() => db.operationalCosts.orderBy('date').reverse().toArray(), []);

  const addCost = async (data: Omit<OperationalCost, 'id' | 'createdAt'>) => {
    await db.operationalCosts.add({
      ...data,
      createdAt: new Date().toISOString(),
    });
  };

  const updateCost = async (id: number, data: Partial<OperationalCost>) => {
    await db.operationalCosts.update(id, data);
  };

  const deleteCost = async (id: number) => {
    await db.operationalCosts.delete(id);
  };

  return { costs: costs || [], addCost, updateCost, deleteCost };
}