import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ShoppingCart,
  AlertTriangle
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ChartCard } from './ChartCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function DashboardDesktop() {
  const [stats, setStats] = useState({
    totalRevenue: 28500000,
    totalCustomers: 142,
    totalStock: 1250,
    pendingDebts: 8500000,
  });

  const recentTransactions = [
    { id: 1, customer: 'Bapak Surya', amount: 2500000, status: 'completed', time: '2 jam lalu' },
    { id: 2, customer: 'Ibu Ratih', amount: 1800000, status: 'pending', time: '3 jam lalu' },
    { id: 3, customer: 'Toko Makmur', amount: 3200000, status: 'completed', time: '5 jam lalu' },
    { id: 4, customer: 'Warung Sehat', amount: 950000, status: 'completed', time: '1 hari lalu' },
  ];

  const lowStockItems = [
    { name: 'Udang Medium', stock: 15, unit: 'kg' },
    { name: 'Udang Jumbo', stock: 8, unit: 'kg' },
    { name: 'Udang Kecil', stock: 22, unit: 'kg' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-4 sm:p-6 text-white shadow-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 truncate">Selamat Datang di UdangKu! 🦐</h1>
            <p className="text-blue-100 text-sm sm:text-base">Kelola bisnis udang Anda dengan mudah dan efisien</p>
            <div className="flex gap-2 mt-3 sm:mt-4 flex-wrap">
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                Aktif • Online
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-0">
                12 Transaksi Hari Ini
              </Badge>
            </div>
          </div>
          <div className="hidden lg:block flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          title="Total Pendapatan"
          value={`Rp ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          color="green"
        />
        <StatCard
          title="Jumlah Pelanggan"
          value={stats.totalCustomers}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Total Stok Udang"
          value={`${stats.totalStock} kg`}
          icon={Package}
          trend={{ value: 5.1, isPositive: false }}
          color="orange"
        />
        <StatCard
          title="Hutang Belum Lunas"
          value={`Rp ${stats.pendingDebts.toLocaleString()}`}
          icon={AlertTriangle}
          trend={{ value: 2.3, isPositive: false }}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard
          title="Penjualan 7 Hari Terakhir"
          trend={{ value: 15.3, isPositive: true }}
          period="Bandingkan dengan minggu lalu"
        >
          <div className="flex items-end justify-between h-full p-3 sm:p-4 gap-1 sm:gap-2">
            {[
              { day: 'Sen', value: 65 },
              { day: 'Sel', value: 80 },
              { day: 'Rab', value: 45 },
              { day: 'Kam', value: 90 },
              { day: 'Jum', value: 70 },
              { day: 'Sab', value: 85 },
              { day: 'Min', value: 60 },
            ].map((bar, index) => (
              <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 flex-1">
                <div 
                  className="w-full max-w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-cyan-500"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">{bar.day}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Stok Udang per Kategori"
          trend={{ value: 8.1, isPositive: true }}
          period="Update terakhir: 1 jam lalu"
        >
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4">
            {[
              { name: 'Udang Jumbo', stock: 450, color: 'bg-gradient-to-r from-orange-500 to-amber-400' },
              { name: 'Udang Medium', stock: 320, color: 'bg-gradient-to-r from-blue-500 to-cyan-400' },
              { name: 'Udang Kecil', stock: 280, color: 'bg-gradient-to-r from-green-500 to-emerald-400' },
              { name: 'Udang Super', stock: 200, color: 'bg-gradient-to-r from-purple-500 to-violet-400' },
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.stock}kg
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Transaksi Terbaru
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
              Lihat Semua
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                      transaction.status === 'completed' 
                        ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
                        : "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300"
                    )}>
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 dark:text-white truncate">{transaction.customer}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.time}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-slate-900 dark:text-white">
                      Rp {transaction.amount.toLocaleString()}
                    </p>
                    <Badge 
                      variant={transaction.status === 'completed' ? "default" : "secondary"}
                      className={cn(
                        "text-xs",
                        transaction.status === 'completed' && "bg-green-100 text-green-700",
                        transaction.status === 'pending' && "bg-orange-100 text-orange-700"
                      )}
                    >
                      {transaction.status === 'completed' ? 'Selesai' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Stok Menipis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white truncate">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Sisa {item.stock} {item.unit}
                    </p>
                  </div>
                  <div className="w-12 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex-shrink-0">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                      style={{ width: `${Math.min(item.stock * 4, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              Restock Sekarang
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}