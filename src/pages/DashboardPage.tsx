import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, Package, Users } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const MetricCard = ({ title, value, icon: Icon, change, changeType }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {change && <p className={`text-xs ${changeType === 'positive' ? 'text-success' : 'text-destructive'}`}>{change}</p>}
    </CardContent>
  </Card>
);

export function DashboardPage() {
    const { todayRevenue, todayExpenses, todayProfit, currentStock, totalCustomers, totalDebt, recentTransactions } = useDashboardData();

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'lunas': return 'bg-success/10 text-success';
            case 'utang': return 'bg-warning/10 text-warning';
            case 'cicil': return 'bg-primary/10 text-primary';
            default: return 'bg-muted';
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-foreground">Dasbor Hari Ini</h2>
                <p className="text-muted-foreground">Ringkasan bisnis untuk hari ini.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard title="Pendapatan" value={formatCurrency(todayRevenue)} icon={DollarSign} />
                <MetricCard title="Pengeluaran" value={formatCurrency(todayExpenses)} icon={TrendingDown} />
                <MetricCard title="Laba Bersih" value={formatCurrency(todayProfit)} icon={TrendingUp} changeType={todayProfit >= 0 ? 'positive' : 'negative'} />
                <MetricCard title="Stok Tersedia" value={`${currentStock.toFixed(1)} kg`} icon={Package} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Transaksi Terbaru</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {recentTransactions.length === 0 ? <p className="text-sm text-muted-foreground">Tidak ada transaksi hari ini.</p> :
                        recentTransactions.map((transaction: any) => (
                            <div key={transaction.id} className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">{transaction.customer}</p>
                                    <p className="text-sm text-muted-foreground">{transaction.time}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{transaction.amount}</p>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}>
                                        {transaction.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Statistik Cepat</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3"><Users className="h-5 w-5 text-muted-foreground" /><span>Total Pelanggan</span></div>
                            <span className="font-semibold">{totalCustomers}</span>
                        </div>
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3"><DollarSign className="h-5 w-5 text-muted-foreground" /><span>Total Piutang</span></div>
                            <span className="font-semibold text-warning">{formatCurrency(totalDebt)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}