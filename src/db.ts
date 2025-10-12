import Dexie, { type Table } from 'dexie';
import { Customer, Transaction, StockEntry, OperationalCost, Settings, Debt, DebtPayment } from '@/types';
import { defaultSettings } from '@/hooks/useSettings';

export class UdangKuDB extends Dexie {
  customers!: Table<Customer>;
  transactions!: Table<Transaction>;
  stockEntries!: Table<StockEntry>;
  operationalCosts!: Table<OperationalCost>;
  settings!: Table<Settings>;
  debts!: Table<Debt>;
  debtPayments!: Table<DebtPayment>;

  constructor() {
    super('UdangKuDatabase');
    
    // Version 1: Initial schema
    this.version(1).stores({
      customers: '++id, &name', // ++id is auto-increment, &name means name is unique and indexed
      transactions: '++id, customerId, date, createdAt',
      stockEntries: '++id, date, createdAt',
      operationalCosts: '++id, date, createdAt',
      settings: '++id', // Auto-increment untuk id settings
    });
    
    // Version 2: Added debt tables
    this.version(2).stores({
      customers: '++id, &name',
      transactions: '++id, customerId, date, createdAt',
      stockEntries: '++id, date, createdAt',
      operationalCosts: '++id, date, createdAt',
      settings: '++id',
      debts: '++id, customerId, transactionId, status, dueDate',
      debtPayments: '++id, debtId, paymentDate',
    });
    
    // Version 3: Enhanced settings schema with comprehensive configuration options
    this.version(3).stores({
      customers: '++id, &name',
      transactions: '++id, customerId, date, createdAt',
      stockEntries: '++id, date, createdAt',
      operationalCosts: '++id, date, createdAt',
      settings: '++id', // Enhanced settings with all new fields
      debts: '++id, customerId, transactionId, status, dueDate',
      debtPayments: '++id, debtId, paymentDate',
    });
  }
}

export const db = new UdangKuDB();

// Function to populate default settings if they don't exist
export async function initializeSettings() {
  try {
    const settingsCount = await db.settings.count();
    if (settingsCount === 0) {
      // Create settings with all required fields from defaultSettings
      const initialSettings = {
        ...defaultSettings,
        id: 1,
        createdAt: new Date().toISOString(),
      };
      
      await db.settings.add(initialSettings);
      console.log('✅ Settings initialized with default values');
    } else {
      // Check if existing settings need to be updated with new fields
      const existingSettings = await db.settings.toArray();
      if (existingSettings.length > 0) {
        const settings = existingSettings[0];
        
        // Check if settings has all required fields from the new schema
        const requiredFields = Object.keys(defaultSettings) as Array<keyof Settings>;
        const missingFields = requiredFields.filter(field => !(field in settings));
        
        if (missingFields.length > 0) {
          console.log('🔄 Updating existing settings with new fields:', missingFields);
          
          // Add missing fields with default values
          const updatedSettings = {
            ...defaultSettings,
            ...settings,
            updatedAt: new Date().toISOString(),
          };
          
          await db.settings.update(settings.id!, updatedSettings);
          console.log('✅ Settings updated with new fields');
        }
      }
    }
  } catch (error) {
    console.error('❌ Error initializing settings:', error);
    throw error;
  }
}