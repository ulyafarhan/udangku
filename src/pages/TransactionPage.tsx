import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Search, Plus, MoreVertical, Trash2 } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { Transaction } from "@/types";

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const { deleteTransaction } = useTransactions();
    const [alertOpen, setAlertOpen] = useState(false);

    const getStatusClass = (status: string) => {
        switch (status) {
            case 'lunas': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'utang': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
            case 'cicil': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300';
        }
    };

    return (
        <>
            <Card className="p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-grow space-y-2 text-left min-w-0">
                  <h3 className="font-semibold text-slate-900 dark:text-white truncate">{transaction.customerName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {transaction.shrimpType} • {transaction.quantity} kg
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    {new Date(transaction.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right space-y-2 flex-shrink-0">
                  <p className="font-bold text-slate-900 dark:text-white">{formatCurrency(transaction.totalAmount)}</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setAlertOpen(true)} className="text-red-600 dark:text-red-400">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {transaction.remainingDebt > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-orange-600 dark:text-orange-400 font-medium text-right">
                    Sisa utang: {formatCurrency(transaction.remainingDebt)}
                  </p>
                </div>
              )}
            </Card>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="sm:max-w-[400px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-slate-900 dark:text-white">Hapus Transaksi?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
                        Tindakan ini akan menghapus data transaksi secara permanen. Data yang sudah dihapus tidak dapat dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600">Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600"
                          onClick={() => transaction?.id && deleteTransaction(transaction.id)}
                        >
                          Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};


export function TransactionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { transactions } = useTransactions();
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredTransactions = transactions.filter(t =>
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Riwayat Transaksi</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola dan pantau semua transaksi penjualan udang
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> 
          Transaksi Baru
        </Button>
      </div>

      {/* Search Section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input 
          placeholder="Cari berdasarkan nama pelanggan..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
        />
      </div>

      {/* Transactions List */}
      <div className="space-y-3 sm:space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-slate-300 dark:border-slate-600">
            <div className="text-slate-400 dark:text-slate-500 mb-2">
              <Package className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Belum ada transaksi</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Buat transaksi pertama Anda untuk memulai
            </p>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      {/* Add Transaction Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800">
            <TransactionForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}