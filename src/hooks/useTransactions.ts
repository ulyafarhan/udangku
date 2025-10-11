import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Transaction } from '@/types';

export function useTransactions() {
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray(), []);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'remainingDebt' | 'status'>) => {
    let customer = await db.customers.where('name').equalsIgnoreCase(data.customerName).first();
    if (!customer) {
      const newCustomerId = await db.customers.add({
        name: data.customerName,
        createdAt: new Date().toISOString(),
      });
      customer = await db.customers.get(newCustomerId);
    }
    
    if (!customer || !customer.id) {
        throw new Error("Gagal membuat atau menemukan pelanggan.");
    }

    const remainingDebt = data.totalAmount - data.paidAmount;
    const status = remainingDebt <= 0 ? 'lunas' : remainingDebt > 0 && data.paidAmount > 0 ? 'cicil' : 'utang';

    await db.transactions.add({
      ...data,
      customerId: customer.id,
      remainingDebt,
      status,
      createdAt: new Date().toISOString(),
    });
  };

  const deleteTransaction = async (id: number) => {
    // Tidak ada logika pengembalian stok di sini karena
    // stockData di useStock akan otomatis menghitung ulang berdasarkan
    // daftar transaksi yang ada. Cukup hapus transaksinya.
    await db.transactions.delete(id);
  };
  
  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
      await db.transactions.update(id, data);
  }

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return transactions?.filter(t => t.date >= startDate && t.date <= endDate) || [];
  }

  return { transactions: transactions || [], addTransaction, deleteTransaction, updateTransaction, getTransactionsByDateRange };
}