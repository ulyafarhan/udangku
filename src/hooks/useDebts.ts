import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Debt, DebtPayment } from '@/types';

export function useDebts() {
  const debts = useLiveQuery(() => db.debts.toArray(), []);
  const debtPayments = useLiveQuery(() => db.debtPayments.toArray(), []);

  const addDebt = async (debt: Omit<Debt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    return await db.debts.add({
      ...debt,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateDebt = async (id: number, updates: Partial<Debt>) => {
    return await db.debts.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  };

  const addDebtPayment = async (payment: Omit<DebtPayment, 'id' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const debt = await db.debts.get(payment.debtId);
    
    if (!debt) {
      throw new Error('Utang tidak ditemukan');
    }

    const newRemainingAmount = debt.remainingAmount - payment.amount;
    let newStatus: 'pending' | 'partial' | 'paid' = 'partial';
    
    if (newRemainingAmount <= 0) {
      newStatus = 'paid';
    } else if (newRemainingAmount === debt.originalAmount) {
      newStatus = 'pending';
    }

    // Tambahkan pembayaran
    await db.debtPayments.add({
      ...payment,
      createdAt: now,
    });

    // Update utang
    await updateDebt(payment.debtId, {
      remainingAmount: Math.max(0, newRemainingAmount),
      status: newStatus,
    });
  };

  const getDebtById = async (id: number) => {
    return await db.debts.get(id);
  };

  const getDebtPayments = (debtId: number) => {
    return useLiveQuery(() => 
      db.debtPayments.where('debtId').equals(debtId).toArray(), 
      [debtId]
    );
  };

  const getDebtsByCustomer = (customerId: number) => {
    return useLiveQuery(() => 
      db.debts.where('customerId').equals(customerId).toArray(), 
      [customerId]
    );
  };

  const exportDebts = async () => {
    const allDebts = await db.debts.toArray();
    const allPayments = await db.debtPayments.toArray();
    
    return {
      debts: allDebts,
      payments: allPayments,
      exportDate: new Date().toISOString(),
    };
  };

  return {
    debts: debts || [],
    debtPayments: debtPayments || [],
    addDebt,
    updateDebt,
    addDebtPayment,
    getDebtById,
    getDebtPayments,
    getDebtsByCustomer,
    exportDebts,
  };
}