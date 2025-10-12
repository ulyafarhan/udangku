'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { useOperationalCosts, AddCostData } from '@/hooks/useOperationalCosts';
import { OperationalCost } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const costSchema = z.object({
  date: z.date({ required_error: 'Tanggal wajib diisi.' }),
  description: z.string().min(1, 'Keterangan wajib diisi.'),
  amount: z.coerce.number().positive('Jumlah harus lebih dari 0.'),
  category: z.string().min(1, 'Kategori wajib diisi.'),
});

type CostFormValues = z.infer<typeof costSchema>;

interface CostFormProps {
  cost?: OperationalCost;
  onSuccess: () => void;
}

export function CostForm({ cost, onSuccess }: CostFormProps) {
  const { addCost, updateCost } = useOperationalCosts();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CostFormValues>({
    resolver: zodResolver(costSchema),
    defaultValues: {
        date: cost ? new Date(cost.date) : new Date(),
        description: cost ? cost.description : '',
        amount: cost ? cost.amount : undefined,
        category: cost ? cost.category : 'Operasional',
    },
  });

  useEffect(() => {
    form.reset({
        date: cost ? new Date(cost.date) : new Date(),
        description: cost ? cost.description : '',
        amount: cost ? cost.amount : undefined,
        category: cost ? cost.category : 'Operasional',
    });
  }, [cost, form]);

  const onSubmit = async (values: CostFormValues) => {
    setIsLoading(true);
    try {
      const data: AddCostData = {
        ...values,
        date: values.date.toISOString().split('T')[0], // format to YYYY-MM-DD
      };

      if (cost?.id) {
        await updateCost(cost.id, data);
        toast({ title: 'Sukses', description: 'Biaya berhasil diperbarui.' });
      } else {
        await addCost(data);
        toast({ title: 'Sukses', description: 'Biaya baru berhasil dicatat.' });
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
            <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="description" render={({ field }) => ( <FormItem><FormLabel>Keterangan</FormLabel><FormControl><Input placeholder="Contoh: Bensin, Es batu" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField control={form.control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Jumlah (Rp)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="category" render={({ field }) => ( <FormItem><FormLabel>Kategori</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
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
