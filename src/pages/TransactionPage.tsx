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
            case 'lunas': return 'bg-success/10 text-success';
            case 'utang': return 'bg-warning/10 text-warning';
            case 'cicil': return 'bg-primary/10 text-primary';
            default: return 'bg-muted';
        }
    };

    return (
        <>
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-grow space-y-1 text-left">
                  <h3 className="font-medium text-foreground">{transaction.customerName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.shrimpType} • {transaction.quantity} kg • {new Date(transaction.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right space-y-1 mr-2">
                  <p className="font-semibold text-foreground">{formatCurrency(transaction.totalAmount)}</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(transaction.status)}`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 -mr-2"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setAlertOpen(true)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
              </div>
              {transaction.remainingDebt > 0 && (
                <div className="mt-2 pt-2 border-t text-right">
                  <p className="text-sm text-warning font-medium">Sisa utang: {formatCurrency(transaction.remainingDebt)}</p>
                </div>
              )}
            </Card>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data transaksi ini secara permanen.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => transaction?.id && deleteTransaction(transaction.id)}>Hapus</AlertDialogAction>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Riwayat Transaksi</h2>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Transaksi Baru</Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Cari berdasarkan nama pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card className="p-6 text-center"><p className="text-muted-foreground">Belum ada transaksi</p></Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px]">
            <TransactionForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}