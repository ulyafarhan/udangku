import Dexie, { type Table } from 'dexie';
import { Customer, Transaction, StockEntry, OperationalCost, Settings } from '@/types';

export class UdangKuDB extends Dexie {
  customers!: Table<Customer>;
  transactions!: Table<Transaction>;
  stockEntries!: Table<StockEntry>;
  operationalCosts!: Table<OperationalCost>;
  settings!: Table<Settings>;

  constructor() {
    super('UdangKuDatabase');
    this.version(1).stores({
      customers: '++id, &name', // ++id is auto-increment, &name means name is unique and indexed
      transactions: '++id, customerId, date, createdAt',
      stockEntries: '++id, date, createdAt',
      operationalCosts: '++id, date, createdAt',
      settings: '++id', // Auto-increment untuk id settings
    });
  }
}

export const db = new UdangKuDB();

// Function to populate default settings if they don't exist
export async function initializeSettings() {
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      id: 1,
      defaultShrinkagePercentage: 2,
      defaultDailyPrice: 25000,
    });
  }
}