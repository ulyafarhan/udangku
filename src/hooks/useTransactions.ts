import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Transaction } from '@/types';
import { useStock } from './useStock';

export function useTransactions() {
  const { stockEntries } = useStock(); // Gunakan hook stok untuk re-kalkulasi
  const transactions = useLiveQuery(() => db.transactions.orderBy('date').reverse().toArray(), []);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'createdAt' | 'remainingDebt' | 'status'>) => {
    // Cari pelanggan berdasarkan nama (case-insensitive)
    let customer = await db.customers.where('name').equalsIgnoreCase(data.customerName).first();

    // Jika pelanggan tidak ditemukan, buat baru
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

    // Kalkulasi sisa utang dan status
    const remainingDebt = data.totalAmount - data.paidAmount;
    const status = remainingDebt <= 0 ? 'lunas' : data.paymentMethod === 'utang' ? 'utang' : 'cicil';

    await db.transactions.add({
      ...data,
      customerId: customer.id,
      remainingDebt,
      status,
      createdAt: new Date().toISOString(),
    });
  };

  const deleteTransaction = async (id: number) => {
    await db.transactions.delete(id);
  };
  
  // Fungsi ini bisa dikembangkan lebih lanjut jika diperlukan
  const updateTransaction = async (id: number, data: Partial<Transaction>) => {
      await db.transactions.update(id, data);
  }

  return { transactions: transactions || [], addTransaction, deleteTransaction, updateTransaction };
}