'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { useStock, AddStockEntryData } from '@/hooks/useStock';
import { StockEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const stockSchema = z.object({
  date: z.date({ required_error: 'Tanggal wajib diisi.' }),
  supplierName: z.string().min(1, 'Nama pemasok wajib diisi.'),
  grossWeight: z.coerce.number().positive('Berat harus lebih dari 0.'),
  buyPrice: z.coerce.number().positive('Harga beli harus lebih dari 0.'),
  shrinkagePercentage: z.coerce.number().nonnegative('Penyusutan tidak boleh negatif.'),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface StockFormProps {
  entry?: StockEntry;
  onSuccess: () => void;
}

export function StockForm({ entry, onSuccess }: StockFormProps) {
  const { addStockEntry, updateStockEntry } = useStock();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
        date: entry ? new Date(entry.date) : new Date(),
        supplierName: entry ? entry.supplierName : '',
        grossWeight: entry ? entry.grossWeight : undefined,
        buyPrice: entry ? entry.buyPrice : undefined,
        shrinkagePercentage: entry ? entry.shrinkagePercentage : 2,
    },
  });

  useEffect(() => {
    form.reset({
        date: entry ? new Date(entry.date) : new Date(),
        supplierName: entry ? entry.supplierName : '',
        grossWeight: entry ? entry.grossWeight : undefined,
        buyPrice: entry ? entry.buyPrice : undefined,
        shrinkagePercentage: entry ? entry.shrinkagePercentage : 2,
    });
  }, [entry, form]);

  const onSubmit = async (values: StockFormValues) => {
    setIsLoading(true);
    try {
      const data: AddStockEntryData = {
        ...values,
        date: values.date.toISOString().split('T')[0], // format to YYYY-MM-DD
      };

      if (entry?.id) {
        await updateStockEntry(entry.id, data);
        toast({ title: 'Sukses', description: 'Stok berhasil diperbarui.' });
      } else {
        await addStockEntry(data);
        toast({ title: 'Sukses', description: 'Stok baru berhasil ditambahkan.' });
      }
      onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan saat menyimpan data.',
        variant: 'destructive',
      });
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal Masuk</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="supplierName" render={({ field }) => ( <FormItem><FormLabel>Nama Pemasok</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormField control={form.control} name="grossWeight" render={({ field }) => ( <FormItem><FormLabel>Berat Kotor (kg)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="buyPrice" render={({ field }) => ( <FormItem><FormLabel>Harga Beli/kg</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
          <FormField control={form.control} name="shrinkagePercentage" render={({ field }) => ( <FormItem><FormLabel>Penyusutan (%)</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
            Simpan
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
