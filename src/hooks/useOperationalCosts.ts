import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { OperationalCost } from '@/types';

// Define the type for the data needed to create a cost
export type AddCostData = Omit<OperationalCost, 'id' | 'createdAt' | 'updatedAt'>;

export function useOperationalCosts() {
  const costs = useLiveQuery(() => db.operationalCosts.orderBy('date').reverse().toArray(), []);

  const addCost = async (data: AddCostData) => {
    const now = new Date().toISOString();
    await db.operationalCosts.add({
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateCost = async (id: number, data: Partial<AddCostData>) => {
    const now = new Date().toISOString();
    await db.operationalCosts.update(id, {
        ...data,
        updatedAt: now,
    });
  };

  const deleteCost = async (id: number) => {
    await db.operationalCosts.delete(id);
  };

  return { costs: costs || [], addCost, updateCost, deleteCost };
}
