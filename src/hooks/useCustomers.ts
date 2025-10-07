import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Customer } from '@/types';

export function useCustomers() {
  // Mengambil data pelanggan secara real-time, diurutkan berdasarkan nama
  const customers = useLiveQuery(() => db.customers.orderBy('name').toArray(), []);

  const addCustomer = async (data: Omit<Customer, 'id' | 'createdAt'>) => {
    // Memastikan nama pelanggan belum ada (mengabaikan huruf besar/kecil)
    const existing = await db.customers.where('name').equalsIgnoreCase(data.name).first();
    if (existing) {
      throw new Error('Nama pelanggan sudah ada.');
    }
    await db.customers.add({
      ...data,
      createdAt: new Date().toISOString(),
    });
  };

  const updateCustomer = async (id: number, data: Omit<Customer, 'id' | 'createdAt'>) => {
    // Cek duplikasi nama jika nama diubah
    const existing = await db.customers.where('name').equalsIgnoreCase(data.name).first();
    if (existing && existing.id !== id) {
        throw new Error('Nama pelanggan sudah digunakan oleh data lain.');
    }
    await db.customers.update(id, data);
  };

  const deleteCustomer = async (id: number) => {
    // Di masa depan, kita bisa tambahkan logika untuk memeriksa apakah pelanggan masih punya transaksi
    await db.customers.delete(id);
  };
  
  const getCustomerStats = (customerId: number | undefined) => {
    // Mengambil data transaksi untuk pelanggan spesifik secara real-time
    const transactions = useLiveQuery(
      () => customerId ? db.transactions.where('customerId').equals(customerId).toArray() : [], 
      [customerId]
    );

    if (!transactions) return { totalTransactions: 0, totalDebt: 0, totalSpent: 0 };

    const totalTransactions = transactions.length;
    const totalDebt = transactions.reduce((sum, t) => sum + t.remainingDebt, 0);
    const totalSpent = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
    return { totalTransactions, totalDebt, totalSpent };
  };


  return { customers: customers || [], addCustomer, updateCustomer, deleteCustomer, getCustomerStats };
}