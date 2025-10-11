import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { StockEntry, Transaction } from '@/types';

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

  const addStockEntry = async (data: Omit<StockEntry, 'id' | 'netWeight' | 'totalCost'>) => {
    const netWeight = Math.round(data.grossWeight * (1 - data.shrinkagePercentage / 100));
    const totalCost = Math.round(data.grossWeight * data.buyPrice);
    await db.stockEntries.add({
      ...data,
      netWeight,
      totalCost,
    });
  };

  const updateStockEntry = async (id: number, data: Omit<StockEntry, 'id' | 'netWeight' | 'totalCost'>) => {
    const netWeight = Math.round(data.grossWeight * (1 - data.shrinkagePercentage / 100));
    const totalCost = Math.round(data.grossWeight * data.buyPrice);
    await db.stockEntries.update(id, {
      ...data,
      netWeight,
      totalCost,
    });
  };

  const deleteStockEntry = async (id: number) => {
    await db.stockEntries.delete(id);
  };

  return { stockEntries: stockEntries || [], stockData, addStockEntry, updateStockEntry, deleteStockEntry };
}