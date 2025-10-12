import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDebts } from "@/hooks/useDebts";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function DebtPage() {
  const { debts, addDebtPayment } = useDebts();
  const { toast } = useToast();
  const [selectedDebt, setSelectedDebt] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  const handlePayment = async () => {
    if (!selectedDebt || !paymentAmount) return;

    try {
      await addDebtPayment({
        debtId: selectedDebt.id,
        amount: parseFloat(paymentAmount),
        paymentDate: new Date().toISOString(),
        notes: paymentNotes,
      });

      toast({
        title: "Pembayaran Berhasil",
        description: `Pembayaran sebesar ${formatCurrency(parseFloat(paymentAmount))} telah dicatat.`,
      });

      setPaymentAmount("");
      setPaymentNotes("");
      setSelectedDebt(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mencatat pembayaran: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'partial': return 'bg-yellow-500';
      case 'pending': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Lunas';
      case 'partial': return 'Sebagian';
      case 'pending': return 'Menunggu';
      default: return 'Tidak Diketahui';
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0);
  const pendingDebts = debts.filter(d => d.status !== 'paid').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">Manajemen Utang</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Kelola dan lacak pembayaran utang pelanggan.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Utang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-600 truncate">{formatCurrency(totalDebt)}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Jumlah Utang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{debts.length}</div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Belum Lunas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{pendingDebts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Daftar Utang</CardTitle>
        </CardHeader>
        <CardContent>
          {debts.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-slate-400 text-xl">💰</span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">Belum ada data utang.</p>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">Utang akan muncul saat ada transaksi dengan pembayaran tertunda.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {debts.map((debt) => (
                <div key={debt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200">
                  <div className="flex-1 min-w-0 mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{debt.customerName}</h3>
                      <Badge className={`${getStatusColor(debt.status)} text-white text-xs`}>
                        {getStatusText(debt.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex justify-between sm:block">
                        <span className="sm:hidden">Total Utang:</span>
                        <span className="font-medium truncate">{formatCurrency(debt.originalAmount)}</span>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="sm:hidden">Sisa:</span>
                        <span className="font-medium text-red-600 truncate">{formatCurrency(debt.remainingAmount)}</span>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="sm:hidden">Jatuh Tempo:</span>
                        <span className="truncate">{formatDate(debt.dueDate)}</span>
                      </div>
                      <div className="flex justify-between sm:block">
                        <span className="sm:hidden">Transaksi ID:</span>
                        <span className="truncate">#{debt.transactionId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {debt.status !== 'paid' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedDebt(debt)}
                            className="text-xs sm:text-sm"
                          >
                            Bayar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-base">Pembayaran Utang</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
                            <div>
                              <Label className="text-xs sm:text-sm">Pelanggan</Label>
                              <p className="font-medium text-sm sm:text-base truncate">{debt.customerName}</p>
                            </div>
                            <div>
                              <Label className="text-xs sm:text-sm">Sisa Utang</Label>
                              <p className="font-medium text-red-600 text-sm sm:text-base truncate">{formatCurrency(debt.remainingAmount)}</p>
                            </div>
                            <div>
                              <Label htmlFor="amount" className="text-xs sm:text-sm">Jumlah Pembayaran</Label>
                              <Input
                                id="amount"
                                type="number"
                                value={paymentAmount}
                                onChange={(e) => setPaymentAmount(e.target.value)}
                                placeholder="Masukkan jumlah pembayaran"
                                className="text-xs sm:text-sm"
                              />
                            </div>
                            <div>
                              <Label htmlFor="notes" className="text-xs sm:text-sm">Catatan (Opsional)</Label>
                              <Input
                                id="notes"
                                value={paymentNotes}
                                onChange={(e) => setPaymentNotes(e.target.value)}
                                placeholder="Catatan tambahan"
                                className="text-xs sm:text-sm"
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setSelectedDebt(null)} className="text-xs sm:text-sm">
                                Batal
                              </Button>
                              <Button onClick={handlePayment} className="text-xs sm:text-sm">
                                Bayar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}