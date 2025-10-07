import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { StockEntry, Transaction } from '@/types';

export function useStock() {
  // Mengambil data stok & transaksi secara real-time dari database
  const stockEntries = useLiveQuery(() => db.stockEntries.orderBy('date').toArray(), []);
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);

  // Menghitung data agregat stok
  const stockData = React.useMemo(() => {
    if (!stockEntries || !transactions) {
      return { currentStock: 0, totalPurchased: 0, totalSold: 0 };
    }
    const totalPurchased = stockEntries.reduce((sum, entry) => sum + entry.netWeight, 0);
    const totalSold = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const currentStock = totalPurchased - totalSold;
    return { currentStock, totalPurchased, totalSold };
  }, [stockEntries, transactions]);

  // Fungsi untuk menambah entri stok baru
  const addStockEntry = async (data: Omit<StockEntry, 'id' | 'netWeight' | 'totalCost'>) => {
    const netWeight = data.grossWeight * (1 - data.shrinkagePercentage / 100);
    const totalCost = data.grossWeight * data.buyPrice;
    await db.stockEntries.add({
      ...data,
      netWeight,
      totalCost,
    });
  };

  // ... (fungsi update & delete akan kita tambahkan nanti saat dibutuhkan)

  return { stockEntries: stockEntries || [], stockData };
}