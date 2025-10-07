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
}

export interface Settings {
  id?: number; // Usually only one entry with id: 1
  defaultShrinkagePercentage: number;
  defaultDailyPrice: number;
}