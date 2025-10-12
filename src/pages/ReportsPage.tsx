import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useReports, exportReportToPDF } from "@/hooks/useReports";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Calendar, TrendingUp, TrendingDown, DollarSign, Package, Users } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ReportsPage() {
  const [dateRange, setDateRange] = useState('30');
  const [isExporting, setIsExporting] = useState(false);
  const {
    dailySalesData,
    monthlySummary,
    paymentMethodDistribution,
    topCustomers,
    stockVsSalesData,
    isLoading
  } = useReports();

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await exportReportToPDF(
        dailySalesData,
        monthlySummary,
        paymentMethodDistribution,
        topCustomers,
        stockVsSalesData
      );
    } catch (error) {
      console.error('Error exporting PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">Laporan</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Analisis penjualan dan performa bisnis.</p>
        </div>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-muted-foreground text-sm sm:text-base">Memuat data laporan...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate percentages for payment method distribution
  const totalPaymentAmount = paymentMethodDistribution.reduce((sum, item) => sum + item.amount, 0);
  const paymentMethodData = paymentMethodDistribution.map(item => ({
    ...item,
    percentage: totalPaymentAmount > 0 ? Math.round((item.amount / totalPaymentAmount) * 100) : 0
  }));

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">Laporan</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Analisis penjualan dan performa bisnis.</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Badge variant="outline" className="bg-blue-50 text-xs sm:text-sm">
            30 Hari Terakhir
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(monthlySummary.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlySummary.totalTransactions} transaksi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pembelian</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(monthlySummary.totalPurchases)}
            </div>
            <p className="text-xs text-muted-foreground">
              {monthlySummary.totalStockEntries} pembelian stok
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Biaya Operasional</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(monthlySummary.totalOperationalCosts)}
            </div>
            <p className="text-xs text-muted-foreground">
              Biaya harian
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Laba Bersih</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              monthlySummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(monthlySummary.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              Penjualan - Pembelian - Biaya
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 sm:gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl truncate">Penjualan Harian</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Tren penjualan harian dalam 30 hari terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl truncate">Ringkasan Bulanan</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Total penjualan dan transaksi per bulan
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySummary}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="totalSales" fill="#3b82f6" />
                    <Bar dataKey="totalTransactions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl truncate">Metode Pembayaran</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Distribusi pembayaran berdasarkan metode
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage}%)`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="amount"
                      fontSize={10}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl truncate">Pelanggan Teratas</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                5 pelanggan dengan total pembelian terbanyak
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 sm:space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm sm:text-base truncate">{customer.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {customer.transactionCount} transaksi
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm sm:text-base">Rp {customer.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl truncate">Stok vs Penjualan</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Perbandingan stok awal dan penjualan per produk
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stockVsSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" fontSize={10} angle={-45} textAnchor="end" height={60} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="initialStock" fill="#3b82f6" />
                    <Bar dataKey="sold" fill="#ef4444" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full sm:w-auto"
        >
          {isExporting ? 'Mengekspor...' : 'Export Laporan (PDF)'}
        </Button>
      </div>
    </div>
  );
}