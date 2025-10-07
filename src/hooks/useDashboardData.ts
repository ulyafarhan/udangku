import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { endOfDay, startOfDay, subDays } from 'date-fns';

export function useDashboardData() {
  // Mengambil semua data yang dibutuhkan secara real-time
  const transactions = useLiveQuery(() => db.transactions.toArray(), []);
  const costs = useLiveQuery(() => db.operationalCosts.toArray(), []);
  const stockEntries = useLiveQuery(() => db.stockEntries.toArray(), []);
  const customers = useLiveQuery(() => db.customers.toArray(), []);
  
  const metrics = useMemo(() => {
    if (!transactions || !costs || !stockEntries || !customers) {
      return {
        todayRevenue: 0,
        todayExpenses: 0,
        todayProfit: 0,
        currentStock: 0,
        totalCustomers: 0,
        totalDebt: 0,
        recentTransactions: [],
      };
    }

    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());

    // Filter data untuk hari ini
    const todayTransactions = transactions.filter(t => new Date(t.date) >= todayStart && new Date(t.date) <= todayEnd);
    const todayCosts = costs.filter(c => new Date(c.date) >= todayStart && new Date(c.date) <= todayEnd);
    const todayStockEntries = stockEntries.filter(e => new Date(e.date) >= todayStart && new Date(e.date) <= todayEnd);

    // Kalkulasi metrik
    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const todayOperationalCosts = todayCosts.reduce((sum, c) => sum + c.amount, 0);
    const todayPurchaseCosts = todayStockEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
    const todayExpenses = todayOperationalCosts + todayPurchaseCosts;
    const todayProfit = todayRevenue - todayExpenses;
    
    // Data agregat
    const totalPurchased = stockEntries.reduce((sum, entry) => sum + entry.netWeight, 0);
    const totalSold = transactions.reduce((sum, t) => sum + t.quantity, 0);
    const currentStock = totalPurchased - totalSold;
    const totalDebt = transactions.reduce((sum, t) => sum + t.remainingDebt, 0);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3) // Ambil 3 transaksi terbaru
      .map(t => ({
        id: t.id,
        customer: t.customerName,
        amount: `Rp ${t.totalAmount.toLocaleString('id-ID')}`,
        status: t.status.charAt(0).toUpperCase() + t.status.slice(1),
        time: new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }));

    return {
      todayRevenue,
      todayExpenses,
      todayProfit,
      currentStock,
      totalCustomers: customers.length,
      totalDebt,
      recentTransactions,
    };
  }, [transactions, costs, stockEntries, customers]);

  return metrics;
}