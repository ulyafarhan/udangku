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
import { Plus, Search, MoreVertical, Edit, Trash2, User, Phone, MapPin } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types";

const customerSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi."),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const CustomerForm = ({ customer, onSuccess }: { customer?: Customer; onSuccess: () => void; }) => {
    const { addCustomer, updateCustomer } = useCustomers();
    const [error, setError] = useState<string | null>(null);
    const form = useForm<z.infer<typeof customerSchema>>({
        resolver: zodResolver(customerSchema),
    });

    useEffect(() => {
        form.reset({
            name: customer?.name || "",
            phone: customer?.phone || "",
            address: customer?.address || "",
        });
    }, [customer, form]);

    const handleSubmit = async (values: z.infer<typeof customerSchema>) => {
        setError(null);
        try {
            if (customer?.id) {
                await updateCustomer(customer.id, values);
            } else {
                await addCustomer(values);
            }
            onSuccess();
        } catch (e: any) {
            setError(e.message);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <DialogHeader>
                    <DialogTitle>{customer ? 'Ubah Pelanggan' : 'Tambah Pelanggan Baru'}</DialogTitle>
                </DialogHeader>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Nama</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>No. HP</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="address" render={({ field }) => ( <FormItem><FormLabel>Alamat</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                    <Button type="submit">Simpan</Button>
                </DialogFooter>
            </form>
        </Form>
    );
};

const CustomerCard = ({ customer }: { customer: Customer }) => {
    const { getCustomerStats } = useCustomers();
    const stats = getCustomerStats(customer.id);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const { deleteCustomer } = useCustomers();

    return (
        <>
            <Card className="flex flex-col">
                <CardHeader className="flex-row items-start justify-between">
                    <div className="space-y-1.5">
                        <CardTitle>{customer.name}</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1">
                            {customer.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{customer.phone}</span></div>}
                            {customer.address && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{customer.address}</span></div>}
                        </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setDialogOpen(true)}> <Edit className="mr-2 h-4 w-4" />Ubah</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAlertOpen(true)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="mt-auto space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Transaksi</span><span className="font-medium">{stats.totalTransactions}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Belanja</span><span className="font-medium">{formatCurrency(stats.totalSpent)}</span></div>
                    {stats.totalDebt > 0 && (
                      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sisa Utang</span><span className="font-medium text-warning">{formatCurrency(stats.totalDebt)}</span></div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent><CustomerForm customer={customer} onSuccess={() => setDialogOpen(false)} /></DialogContent>
            </Dialog>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus data pelanggan secara permanen.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => customer?.id && deleteCustomer(customer.id)}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export function CustomerPage() {
    const { customers } = useCustomers();
    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    
    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-2xl font-bold text-foreground">Pelanggan</h2>
                <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" /> Tambah Pelanggan</Button>
            </div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari nama pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.length === 0 ? (
                    <p className="text-muted-foreground text-center col-span-full py-10">Tidak ada pelanggan ditemukan.</p>
                ) : (
                    filteredCustomers.map(customer => <CustomerCard key={customer.id} customer={customer} />)
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent><CustomerForm onSuccess={() => setDialogOpen(false)} /></DialogContent>
            </Dialog>
        </div>
    );
}