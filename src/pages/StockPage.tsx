import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { StockEntry, OperationalCost } from "@/types";
import { useStock } from "@/hooks/useStock";
import { useOperationalCosts } from "@/hooks/useOperationalCosts";

const stockSchema = z.object({
  date: z.date({ required_error: "Tanggal wajib diisi." }),
  supplierName: z.string().min(1, "Nama pemasok wajib diisi."),
  grossWeight: z.coerce.number().positive("Berat harus lebih dari 0."),
  buyPrice: z.coerce.number().positive("Harga beli harus lebih dari 0."),
  shrinkagePercentage: z.coerce.number().nonnegative("Penyusutan tidak boleh negatif."),
});

const costSchema = z.object({
  date: z.date({ required_error: "Tanggal wajib diisi." }),
  description: z.string().min(1, "Keterangan wajib diisi."),
  amount: z.coerce.number().positive("Jumlah harus lebih dari 0."),
  category: z.string().min(1, "Kategori wajib diisi."),
});

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const StockForm = ({ entry, onSuccess }: { entry?: StockEntry; onSuccess: () => void; }) => {
  const { addStockEntry, updateStockEntry } = useStock();
  const form = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
  });

  useEffect(() => {
    form.reset({
      date: entry ? new Date(entry.date) : new Date(),
      supplierName: entry ? entry.supplierName : "",
      grossWeight: entry ? entry.grossWeight : undefined,
      buyPrice: entry ? entry.buyPrice : undefined,
      shrinkagePercentage: entry ? entry.shrinkagePercentage : 2,
    });
  }, [entry, form]);

  const handleSubmit = async (values: z.infer<typeof stockSchema>) => {
    const data = { ...values, date: format(values.date, "yyyy-MM-dd") };
    if (entry?.id) {
      await updateStockEntry(entry.id, { ...data, createdAt: entry.createdAt });
    } else {
      await addStockEntry({ ...data, createdAt: new Date().toISOString() });
    }
    onSuccess();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{entry ? 'Ubah Stok' : 'Tambah Stok Udang'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal Masuk</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="supplierName" render={({ field }) => ( <FormItem><FormLabel>Nama Pemasok</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField control={form.control} name="grossWeight" render={({ field }) => ( <FormItem><FormLabel>Berat Kotor (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="buyPrice" render={({ field }) => ( <FormItem><FormLabel>Harga Beli/kg (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="shrinkagePercentage" render={({ field }) => ( <FormItem><FormLabel>Penyusutan (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

const CostForm = ({ cost, onSuccess }: { cost?: OperationalCost; onSuccess: () => void; }) => {
  const { addCost, updateCost } = useOperationalCosts();
   const form = useForm<z.infer<typeof costSchema>>({
    resolver: zodResolver(costSchema),
  });

  useEffect(() => {
    form.reset({
      date: cost ? new Date(cost.date) : new Date(),
      description: cost ? cost.description : "",
      amount: cost ? cost.amount : undefined,
      category: cost ? cost.category : "Operasional",
    });
  }, [cost, form]);
  
  const handleSubmit = async (values: z.infer<typeof costSchema>) => {
    const data = {...values, date: format(values.date, "yyyy-MM-dd")};
    if (cost?.id) {
        await updateCost(cost.id, data);
    } else {
        await addCost(data);
    }
    onSuccess();
  };

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>{cost ? 'Ubah Biaya' : 'Catat Biaya Operasional'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Keterangan</FormLabel><FormControl><Input placeholder="Contoh: Bensin, Es batu" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Jumlah (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Kategori</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
          <Button type="submit">Simpan</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export function StockPage() {
  const { stockEntries, stockData, deleteStockEntry } = useStock();
  const { costs, deleteCost } = useOperationalCosts();

  const [dialogOpen, setDialogOpen] = useState<{ type: 'stock' | 'cost' | null; data?: any }>({ type: null });
  const [alertOpen, setAlertOpen] = useState<{ type: 'stock' | 'cost' | null; id?: number }>({ type: null });

  const closeDialog = () => setDialogOpen({ type: null });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Stok & Biaya</h2>
        <div className="flex gap-2">
          <Button onClick={() => setDialogOpen({ type: 'stock' })}><Plus className="mr-2 h-4 w-4" /> Udang Masuk</Button>
          <Button onClick={() => setDialogOpen({ type: 'cost' })} variant="outline"><Plus className="mr-2 h-4 w-4" /> Catat Biaya</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Riwayat Stok Masuk</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stockEntries?.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Belum ada stok masuk</p> : 
              stockEntries?.map(entry => (
                <div key={entry.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                   <div>
                    <p className="font-medium">{entry.supplierName}</p>
                    <p className="text-sm text-muted-foreground">{entry.date} • {entry.grossWeight} kg → {entry.netWeight.toFixed(1)} kg</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(entry.totalCost)}</p>
                      <p className="text-sm text-muted-foreground">@{formatCurrency(entry.buyPrice)}/kg</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDialogOpen({ type: 'stock', data: entry })}> <Edit className="mr-2 h-4 w-4" />Ubah</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => entry?.id && setAlertOpen({ type: 'stock', id: entry.id })} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Riwayat Biaya Operasional</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {costs?.length === 0 ? <p className="text-sm text-muted-foreground text-center py-4">Belum ada biaya</p> : 
              costs?.map(cost => (
                <div key={cost.id} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted/50">
                  <div>
                    <p className="font-medium">{cost.description}</p>
                    <p className="text-sm text-muted-foreground">{cost.date} • {cost.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{formatCurrency(cost.amount)}</p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDialogOpen({ type: 'cost', data: cost })}><Edit className="mr-2 h-4 w-4" />Ubah</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cost?.id && setAlertOpen({ type: 'cost', id: cost.id })} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen.type !== null} onOpenChange={() => closeDialog()}>
        <DialogContent>
            {dialogOpen.type === 'stock' && <StockForm entry={dialogOpen.data} onSuccess={closeDialog} />}
            {dialogOpen.type === 'cost' && <CostForm cost={dialogOpen.data} onSuccess={closeDialog} />}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={alertOpen.type !== null} onOpenChange={() => setAlertOpen({ type: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan dan akan menghapus data secara permanen.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                if(alertOpen.id) {
                    if (alertOpen.type === 'stock') deleteStockEntry(alertOpen.id);
                    if (alertOpen.type === 'cost') deleteCost(alertOpen.id);
                }
                setAlertOpen({ type: null });
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}