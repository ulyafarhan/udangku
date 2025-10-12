import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, subDays } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function useReports() {
  // Get data for the last 30 days
  const endDate = new Date();
  const startDate = subDays(endDate, 30);

  const transactions = useLiveQuery(() => 
    db.transactions
      .where('date')
      .between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
      .toArray(),
    [startDate, endDate]
  );

  const stockEntries = useLiveQuery(() => 
    db.stockEntries
      .where('date')
      .between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
      .toArray(),
    [startDate, endDate]
  );

  const operationalCosts = useLiveQuery(() => 
    db.operationalCosts
      .where('date')
      .between(format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'))
      .toArray(),
    [startDate, endDate]
  );

  // Calculate daily sales data for chart
  const dailySalesData = () => {
    if (!transactions) return [];

    const salesByDate = transactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += transaction.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    // Fill in missing dates with zero
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    return days.map(day => ({
      date: format(day, 'dd MMM'),
      sales: salesByDate[format(day, 'yyyy-MM-dd')] || 0,
    }));
  };

  // Calculate monthly summary
  const monthlySummary = () => {
    if (!transactions || !stockEntries || !operationalCosts) {
      return {
        totalSales: 0,
        totalPurchases: 0,
        totalOperationalCosts: 0,
        netProfit: 0,
        totalTransactions: 0,
        totalStockEntries: 0,
      };
    }

    const totalSales = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalPurchases = stockEntries.reduce((sum, s) => sum + s.totalCost, 0);
    const totalOperationalCosts = operationalCosts.reduce((sum, o) => sum + o.amount, 0);
    const netProfit = totalSales - totalPurchases - totalOperationalCosts;

    return {
      totalSales,
      totalPurchases,
      totalOperationalCosts,
      netProfit,
      totalTransactions: transactions.length,
      totalStockEntries: stockEntries.length,
    };
  };

  // Payment method distribution
  const paymentMethodDistribution = () => {
    if (!transactions) return [];

    const distribution = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.paymentMethod]) {
        acc[transaction.paymentMethod] = 0;
      }
      acc[transaction.paymentMethod] += transaction.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([method, amount]) => ({
      method: method === 'tunai' ? 'Tunai' : method === 'utang' ? 'Utang' : 'Cicil',
      amount,
      percentage: 0, // Will be calculated in component
    }));
  };

  // Top customers by transaction amount
  const topCustomers = () => {
    if (!transactions) return [];

    const customerTotals = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.customerName]) {
        acc[transaction.customerName] = 0;
      }
      acc[transaction.customerName] += transaction.totalAmount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(customerTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, amount]) => ({ name, amount }));
  };

  // Stock vs Sales comparison
  const stockVsSalesData = () => {
    if (!transactions || !stockEntries) return [];

    const salesByDate = transactions.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { sales: 0, stock: 0 };
      }
      acc[date].sales += transaction.quantity;
      return acc;
    }, {} as Record<string, { sales: number; stock: number }>);

    const stockByDate = stockEntries.reduce((acc, stock) => {
      const date = format(new Date(stock.date), 'yyyy-MM-dd');
      if (!acc[date]) {
        acc[date] = { sales: 0, stock: 0 };
      }
      acc[date].stock += stock.netWeight;
      return acc;
    }, {} as Record<string, { sales: number; stock: number }>);

    // Combine data
    const allDates = new Set([...Object.keys(salesByDate), ...Object.keys(stockByDate)]);
    const sortedDates = Array.from(allDates).sort();

    return sortedDates.map(date => ({
      date: format(new Date(date), 'dd MMM'),
      sales: salesByDate[date]?.sales || 0,
      stock: stockByDate[date]?.stock || 0,
    }));
  };

  return {
    dailySalesData: dailySalesData(),
    monthlySummary: monthlySummary(),
    paymentMethodDistribution: paymentMethodDistribution(),
    topCustomers: topCustomers(),
    stockVsSalesData: stockVsSalesData(),
    isLoading: !transactions || !stockEntries || !operationalCosts,
  };
}

export async function exportReportToPDF(
  dailySalesData: any[],
  monthlySummary: any,
  paymentMethodDistribution: any[],
  topCustomers: any[],
  stockVsSalesData: any[]
) {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Laporan Bisnis UdangKu', 14, 22);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Dibuat pada: ${format(new Date(), 'dd MMMM yyyy HH:mm')}`, 14, 30);
  
  // Summary Section
  doc.setFontSize(14);
  doc.text('Ringkasan Bulanan', 14, 45);
  
  const summaryData = [
    ['Total Penjualan', `Rp ${monthlySummary.totalSales.toLocaleString()}`],
    ['Total Pembelian', `Rp ${monthlySummary.totalPurchases.toLocaleString()}`],
    ['Biaya Operasional', `Rp ${monthlySummary.totalOperationalCosts.toLocaleString()}`],
    ['Laba Bersih', `Rp ${monthlySummary.netProfit.toLocaleString()}`],
  ];
  
  (doc as any).autoTable({
    head: [['Keterangan', 'Jumlah']],
    body: summaryData,
    startY: 50,
    theme: 'grid',
    headStyles: { fillColor: [66, 139, 202] }
  });
  
  // Daily Sales Chart Data
  const lastY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Penjualan Harian', 14, lastY);
  
  const salesTableData = dailySalesData.map(item => [
    item.date,
    `Rp ${item.sales.toLocaleString()}`
  ]);
  
  (doc as any).autoTable({
    head: [['Tanggal', 'Penjualan']],
    body: salesTableData,
    startY: lastY + 5,
    theme: 'grid',
    headStyles: { fillColor: [92, 184, 92] }
  });
  
  // Payment Methods
  const paymentLastY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Metode Pembayaran', 14, paymentLastY);
  
  const paymentTableData = paymentMethodDistribution.map(item => [
    item.method,
    `Rp ${item.amount.toLocaleString()}`,
    `${item.count} transaksi`
  ]);
  
  (doc as any).autoTable({
    head: [['Metode', 'Jumlah', 'Transaksi']],
    body: paymentTableData,
    startY: paymentLastY + 5,
    theme: 'grid',
    headStyles: { fillColor: [240, 173, 78] }
  });
  
  // Top Customers
  const customerLastY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Pelanggan Terbaik', 14, customerLastY);
  
  const customerTableData = topCustomers.map(item => [
    item.name,
    `Rp ${item.amount.toLocaleString()}`
  ]);
  
  (doc as any).autoTable({
    head: [['Nama Pelanggan', 'Total Pembelian']],
    body: customerTableData,
    startY: customerLastY + 5,
    theme: 'grid',
    headStyles: { fillColor: [217, 83, 79] }
  });
  
  // Save the PDF
  doc.save(`laporan-udangku-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
}