import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { StockEntry, Transaction } from '@/types';

// Define the type for the data needed to create a stock entry
export type AddStockEntryData = Omit<StockEntry, 'id' | 'netWeight' | 'totalCost' | 'createdAt' | 'updatedAt'>;

// Define the type for the data needed to update a stock entry
export type UpdateStockEntryData = Omit<StockEntry, 'id' | 'createdAt' | 'updatedAt'>;

export function useStock() {
  const stockEntries = useLiveQuery(() => db.stockEntries.orderBy('date').reverse().toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);

  const stockData = React.useMemo(() => {
    if (!stockEntries || !transactions) {
      return { currentStock: 0, totalPurchased: 0, totalSold: 0 };
    }
    const totalPurchased = stockEntries.reduce((sum, entry) => sum + entry.netWeight, 0);
    const totalSold = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const currentStock = totalPurchased - totalSold;
    return { currentStock, totalPurchased, totalSold };
  }, [stockEntries, transactions]);

  const addStockEntry = async (data: AddStockEntryData) => {
    const now = new Date().toISOString();
    const netWeight = Math.round(data.grossWeight * (1 - data.shrinkagePercentage / 100));
    const totalCost = Math.round(data.grossWeight * data.buyPrice);
    
    await db.stockEntries.add({
      ...data,
      netWeight,
      totalCost,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateStockEntry = async (id: number, data: Partial<UpdateStockEntryData>) => {
    const now = new Date().toISOString();
    const entryToUpdate = await db.stockEntries.get(id);
    if (!entryToUpdate) throw new Error("Stock entry not found");

    // Recalculate netWeight and totalCost if relevant fields are updated
    const grossWeight = data.grossWeight ?? entryToUpdate.grossWeight;
    const shrinkagePercentage = data.shrinkagePercentage ?? entryToUpdate.shrinkagePercentage;
    const buyPrice = data.buyPrice ?? entryToUpdate.buyPrice;

    const netWeight = Math.round(grossWeight * (1 - shrinkagePercentage / 100));
    const totalCost = Math.round(grossWeight * buyPrice);

    await db.stockEntries.update(id, {
      ...data,
      netWeight,
      totalCost,
      updatedAt: now,
    });
  };

  const deleteStockEntry = async (id: number) => {
    await db.stockEntries.delete(id);
  };

  return { stockEntries: stockEntries || [], stockData, addStockEntry, updateStockEntry, deleteStockEntry };
}
