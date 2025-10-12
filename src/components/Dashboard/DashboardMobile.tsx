import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function DashboardMobile() {
  const [activeTab, setActiveTab] = useState('overview');

  const quickActions = [
    { name: 'Jual Udang', icon: ShoppingCart, color: 'from-blue-500 to-cyan-400' },
    { name: 'Tambah Stok', icon: Package, color: 'from-green-500 to-emerald-400' },
    { name: 'Catat Hutang', icon: DollarSign, color: 'from-orange-500 to-amber-400' },
    { name: 'Lihat Laporan', icon: TrendingUp, color: 'from-purple-500 to-violet-400' },
  ];

  const recentTransactions = [
    { id: 1, customer: 'Bapak Surya', amount: 2500000, status: 'completed', time: '2j lalu' },
    { id: 2, customer: 'Ibu Ratih', amount: 1800000, status: 'pending', time: '3j lalu' },
    { id: 3, customer: 'Toko Makmur', amount: 3200000, status: 'completed', time: '5j lalu' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 pb-24">
      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardContent className="p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold mb-1 truncate">Halo Admin! 👋</h1>
              <p className="text-blue-100 text-xs sm:text-sm">Bagus pagi ini</p>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  12 Transaksi
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
                  Online
                </Badge>
              </div>
            </div>
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Aksi Cepat</h2>
          <Button variant="ghost" size="sm" className="text-slate-500">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              className={cn(
                "h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 rounded-xl",
                "bg-gradient-to-r text-white font-medium shadow-lg",
                "transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95",
                action.color
              )}
            >
              <action.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-xs sm:text-sm text-center">{action.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                +12%
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">28.5jt</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pendapatan</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <Badge variant="default" className="text-xs bg-blue-100 text-blue-700">
                +8%
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">142</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pelanggan</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
              <Badge variant="default" className="text-xs bg-orange-100 text-orange-700">
                -5%
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">1,250</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Stok (kg)</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <Badge variant="default" className="text-xs bg-red-100 text-red-700">
                3
              </Badge>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">8.5jt</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Hutang</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Transaksi Terbaru</h2>
          <Button variant="ghost" size="sm" className="text-slate-500">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <Card key={transaction.id} className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <Avatar className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0",
                    transaction.status === 'completed' 
                      ? "bg-green-100 dark:bg-green-900" 
                      : "bg-orange-100 dark:bg-orange-900"
                  )}>
                    <AvatarFallback className={cn(
                      "text-xs sm:text-sm font-medium",
                      transaction.status === 'completed' 
                        ? "text-green-700 dark:text-green-300" 
                        : "text-orange-700 dark:text-orange-300"
                    )}>
                      {transaction.customer.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{transaction.customer}</p>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{transaction.time}</p>
                  </div>
                  
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stock Alert */}
      <Card className="bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 border-orange-200 dark:border-orange-800 rounded-xl">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-orange-900 dark:text-orange-100 text-sm sm:text-base">Stok Menipis!</p>
              <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 truncate">
                Udang Medium hanya tersisa 15kg
              </p>
            </div>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs sm:text-sm flex-shrink-0">
              Restock
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}