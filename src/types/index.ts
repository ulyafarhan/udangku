export interface Customer {
  id?: number;
  name: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface StockEntry {
  id?: number;
  supplierName: string;
  date: string;
  grossWeight: number;
  buyPrice: number;
  netWeight: number;
  totalCost: number;
  shrinkagePercentage: number;
  createdAt: string;
}

export interface Transaction {
  id?: number;
  customerId: number;
  customerName: string;
  date: string;
  shrimpType: string;
  quantity: number;
  pricePerKg: number;
  totalAmount: number;
  paymentMethod: 'tunai' | 'utang' | 'cicil';
  paidAmount: number;
  remainingDebt: number;
  status: 'lunas' | 'utang' | 'cicil';
  createdAt: string;
}

export interface OperationalCost {
  id?: number;
  date: string;
  description: string;
  amount: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id?: number; // Usually only one entry with id: 1
  
  // Business Settings
  businessName?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  
  // Default Values
  defaultShrinkagePercentage: number;
  defaultDailyPrice: number;
  
  // Currency & Format
  currency: string;
  currencySymbol: string;
  timezone: string;
  dateFormat: string;
  
  // Notifications
  enableNotifications: boolean;
  enableDebtReminders: boolean;
  debtReminderDays: number;
  
  // Auto Backup
  enableAutoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  
  // Theme & Display
  theme: 'light' | 'dark' | 'auto';
  language: string;
  itemsPerPage: number;
  
  // Working Hours
  workingHoursStart: string;
  workingHoursEnd: string;
  workingDays: string[];
  
  // Debt Settings
  defaultDebtDueDays: number;
  enableAutoDebtReminders: boolean;
  
  createdAt: string;
  updatedAt?: string;
}

export interface Debt {
  id?: number;
  customerId: number;
  customerName: string;
  transactionId: number;
  originalAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'pending' | 'partial' | 'paid';
  createdAt: string;
  updatedAt: string;
}

export interface DebtPayment {
  id?: number;
  debtId: number;
  amount: number;
  paymentDate: string;
  notes?: string;
  createdAt: string;
}