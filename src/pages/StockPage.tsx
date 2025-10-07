import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Plus, Package, TrendingUp, TrendingDown } from "lucide-react";
import { db } from "@/db";
import { useLiveQuery } from "dexie-react-hooks";
import { format } from "date-fns";

// Skema Validasi untuk Form Stok
const stockSchema = z.object({
  date: z.date({ required_error: "Tanggal wajib diisi." }),
  supplierName: z.string().min(1, "Nama pemasok wajib diisi."),
  grossWeight: z.coerce.number().positive("Berat harus lebih dari 0."),
  buyPrice: z.coerce.number().positive("Harga beli harus lebih dari 0."),
  shrinkagePercentage: z.coerce.number().nonnegative("Penyusutan tidak boleh negatif."),
});

// Skema Validasi untuk Form Biaya
const costSchema = z.object({
  date: z.date({ required_error: "Tanggal wajib diisi." }),
  description: z.string().min(1, "Keterangan wajib diisi."),
  amount: z.coerce.number().positive("Jumlah harus lebih dari 0."),
  category: z.string().min(1, "Kategori wajib diisi."),
});

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export function StockPage() {
  const [showStockForm, setShowStockForm] = useState(false);
  const [showCostForm, setShowCostForm] = useState(false);

  const stockEntries = useLiveQuery(() => db.stockEntries.reverse().sortBy('date'), []);
  const costs = useLiveQuery(() => db.operationalCosts.reverse().sortBy('date'), []);

  const stockForm = useForm<z.infer<typeof stockSchema>>({
    resolver: zodResolver(stockSchema),
    defaultValues: { date: new Date(), supplierName: "", grossWeight: 0, buyPrice: 0, shrinkagePercentage: 2 },
  });

  const costForm = useForm<z.infer<typeof costSchema>>({
    resolver: zodResolver(costSchema),
    defaultValues: { date: new Date(), description: "", amount: 0, category: "Operasional" },
  });

  const handleStockSubmit = async (values: z.infer<typeof stockSchema>) => {
    const netWeight = values.grossWeight * (1 - values.shrinkagePercentage / 100);
    const totalCost = values.grossWeight * values.buyPrice;
    
    await db.stockEntries.add({
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      netWeight,
      totalCost,
    });
    
    stockForm.reset();
    setShowStockForm(false);
  };

  const handleCostSubmit = async (values: z.infer<typeof costSchema>) => {
    await db.operationalCosts.add({
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      createdAt: new Date().toISOString(),
    });

    costForm.reset();
    setShowCostForm(false);
  };

  // Tampilan Form Stok
  if (showStockForm) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tambah Stok Udang</h2>
        <Card>
          <CardContent className="pt-6">
            <Form {...stockForm}>
              <form onSubmit={stockForm.handleSubmit(handleStockSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={stockForm.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal Masuk *</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={stockForm.control} name="supplierName" render={({ field }) => ( <FormItem><FormLabel>Nama Pemasok *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField control={stockForm.control} name="grossWeight" render={({ field }) => ( <FormItem><FormLabel>Berat Kotor (kg) *</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={stockForm.control} name="buyPrice" render={({ field }) => ( <FormItem><FormLabel>Harga Beli/kg (Rp) *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={stockForm.control} name="shrinkagePercentage" render={({ field }) => ( <FormItem><FormLabel>Penyusutan (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowStockForm(false)}>Batal</Button>
                  <Button type="submit">Simpan Stok</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Tampilan Form Biaya
  if (showCostForm) {
     return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Catat Biaya Operasional</h2>
        <Card>
          <CardContent className="pt-6">
            <Form {...costForm}>
              <form onSubmit={costForm.handleSubmit(handleCostSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={costForm.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal Biaya *</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )}/>
                  <FormField control={costForm.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Keterangan Biaya *</FormLabel><FormControl><Input placeholder="Contoh: Bensin, Es batu" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={costForm.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Jumlah (Rp) *</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                  <FormField control={costForm.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Kategori</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowCostForm(false)}>Batal</Button>
                  <Button type="submit">Simpan Biaya</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilan Halaman Utama Stok & Biaya
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-foreground">Stok & Biaya</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowStockForm(true)}><Plus className="mr-2 h-4 w-4" /> Udang Masuk</Button>
          <Button onClick={() => setShowCostForm(true)} variant="outline"><Plus className="mr-2 h-4 w-4" /> Catat Biaya</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Riwayat Stok Masuk</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {stockEntries?.length === 0 ? <p className="text-muted-foreground text-center py-4">Belum ada stok masuk</p> : 
              stockEntries?.map(entry => (
                <div key={entry.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{entry.supplierName}</p>
                    <p className="text-sm text-muted-foreground">{entry.date} • {entry.grossWeight} kg → {entry.netWeight.toFixed(1)} kg</p>
                  </div>
                  <div className="text-right">
                     <p className="font-semibold">{formatCurrency(entry.totalCost)}</p>
                     <p className="text-sm text-muted-foreground">@{formatCurrency(entry.buyPrice)}/kg</p>
                  </div>
                </div>
              ))
            }
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Riwayat Biaya Operasional</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {costs?.length === 0 ? <p className="text-muted-foreground text-center py-4">Belum ada biaya</p> : 
              costs?.map(cost => (
                <div key={cost.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{cost.description}</p>
                    <p className="text-sm text-muted-foreground">{cost.date} • {cost.category}</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(cost.amount)}</p>
                </div>
              ))
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}