import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker"; // <--- INI PERBAIKANNYA
import { useTransactions } from "@/hooks/useTransactions";
import { useStock } from "@/hooks/useStock";
import { format } from "date-fns";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/db";

const transactionSchema = z.object({
  date: z.date({ required_error: "Tanggal transaksi wajib diisi." }),
  customerName: z.string().min(1, "Nama pelanggan wajib diisi.").transform(name => 
    name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  ),
  shrimpType: z.string(),
  quantity: z.coerce.number().positive("Jumlah harus lebih dari 0."),
  pricePerKg: z.coerce.number().positive("Harga harus lebih dari 0."),
  paymentMethod: z.enum(["tunai", "utang", "cicil"]),
  paidAmount: z.coerce.number().nonnegative("Jumlah bayar tidak boleh negatif.").optional(),
});

export const TransactionForm = ({ onSuccess }: { onSuccess: () => void; }) => {
    const { addTransaction } = useTransactions();
    const { stockData } = useStock();
    const customers = useLiveQuery(() => db.customers.toArray(), []);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof transactionSchema>>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            date: new Date(),
            customerName: "",
            shrimpType: "Udang Vaname",
            quantity: undefined,
            pricePerKg: undefined,
            paymentMethod: "tunai",
            paidAmount: 0,
        },
    });

    const paymentMethod = form.watch("paymentMethod");
    const quantity = form.watch("quantity") || 0;
    const pricePerKg = form.watch("pricePerKg") || 0;
    const paidAmount = form.watch("paidAmount") || 0;
    const totalAmount = quantity * pricePerKg;

    const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    
    const handleSubmit = async (values: z.infer<typeof transactionSchema>) => {
        setError(null);
        if (values.quantity > stockData.currentStock) {
            setError(`Stok tidak cukup. Stok tersedia: ${stockData.currentStock.toFixed(1)} kg`);
            return;
        }

        try {
            const finalPaidAmount = values.paymentMethod === 'tunai' ? totalAmount : values.paidAmount;
            await addTransaction({
                ...values,
                date: format(values.date, "yyyy-MM-dd"),
                totalAmount,
                paidAmount: finalPaidAmount,
            });
            onSuccess();
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Terjadi kesalahan tidak dikenal.");
            }
        }
    };

    return (
        <>
            <DialogHeader><DialogTitle>Transaksi Baru</DialogTitle></DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
                    {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tanggal</FormLabel><FormControl><DatePicker date={field.value} setDate={field.onChange} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="customerName" render={({ field }) => ( <FormItem><FormLabel>Nama Pelanggan</FormLabel><FormControl><Input list="customer-list" placeholder="Ketik nama baru atau pilih" {...field} /></FormControl><datalist id="customer-list">{customers?.map(c => <option key={c.id} value={c.name} />)}</datalist><FormMessage /></FormItem> )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control} name="shrimpType" render={({ field }) => ( <FormItem><FormLabel>Jenis Udang</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="Udang Vaname">Udang Vaname</SelectItem><SelectItem value="Udang Windu">Udang Windu</SelectItem></SelectContent></Select></FormItem> )}/>
                        <FormField control={form.control} name="quantity" render={({ field }) => ( <FormItem><FormLabel>Jumlah (kg)</FormLabel><FormControl><Input type="number" step="0.1" inputMode="decimal" {...field} /></FormControl><p className="text-xs text-muted-foreground">Stok: {stockData.currentStock.toFixed(1)} kg</p><FormMessage /></FormItem> )}/>
                        <FormField control={form.control} name="pricePerKg" render={({ field }) => ( <FormItem><FormLabel>Harga/kg (Rp)</FormLabel><FormControl><Input type="number" inputMode="numeric" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    </div>
                    <FormField control={form.control} name="paymentMethod" render={({ field }) => ( <FormItem><FormLabel>Metode Bayar</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="tunai" /></FormControl><FormLabel className="font-normal">Tunai</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="utang" /></FormControl><FormLabel className="font-normal">Utang</FormLabel></FormItem><FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem value="cicil" /></FormControl><FormLabel className="font-normal">Cicil</FormLabel></FormItem></RadioGroup></FormControl></FormItem> )}/>
                    {paymentMethod === 'cicil' && ( <FormField control={form.control} name="paidAmount" render={({ field }) => ( <FormItem><FormLabel>Jumlah Dibayar (Rp)</FormLabel><FormControl><Input type="number" inputMode="numeric" {...field} /></FormControl><FormMessage /></FormItem> )}/> )}
                    {totalAmount > 0 && ( <Card className="p-4 bg-muted/30"><div className="space-y-2"><div className="flex justify-between"><span>Total Harga:</span><span className="font-semibold">{formatCurrency(totalAmount)}</span></div>{paymentMethod !== "tunai" && (<div className="flex justify-between text-sm"><span>Sisa Utang:</span><span className="font-medium text-warning">{formatCurrency(totalAmount - paidAmount)}</span></div>)}</div></Card> )}
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                        <Button type="submit">Simpan Transaksi</Button>
                    </DialogFooter>
                </form>
            </Form>
        </>
    );
};
