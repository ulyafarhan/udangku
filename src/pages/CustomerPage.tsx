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
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3 sm:space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-base sm:text-lg">{customer ? 'Ubah Pelanggan' : 'Tambah Pelanggan Baru'}</DialogTitle>
                </DialogHeader>
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <FormField control={form.control} name="name" render={({ field }) => ( 
                    <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Nama</FormLabel>
                        <FormControl>
                            <Input {...field} className="text-xs sm:text-sm" placeholder="Masukkan nama pelanggan" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem> 
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => ( 
                    <FormItem>
                        <FormLabel className="text-xs sm:text-sm">No. HP</FormLabel>
                        <FormControl>
                            <Input type="tel" {...field} className="text-xs sm:text-sm" placeholder="Masukkan nomor HP" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem> 
                )} />
                <FormField control={form.control} name="address" render={({ field }) => ( 
                    <FormItem>
                        <FormLabel className="text-xs sm:text-sm">Alamat</FormLabel>
                        <FormControl>
                            <Input {...field} className="text-xs sm:text-sm" placeholder="Masukkan alamat (opsional)" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                    </FormItem> 
                )} />
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="text-xs sm:text-sm">Batal</Button>
                    </DialogClose>
                    <Button type="submit" className="text-xs sm:text-sm">Simpan</Button>
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
            <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex-row items-start justify-between pb-3">
                    <div className="space-y-1.5 min-w-0 flex-1">
                        <CardTitle className="text-base sm:text-lg truncate">{customer.name}</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1">
                            {customer.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{customer.phone}</span>
                                </div>
                            )}
                            {customer.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{customer.address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem onClick={() => setDialogOpen(true)} className="text-xs sm:text-sm">
                          <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />Ubah
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAlertOpen(true)} className="text-destructive text-xs sm:text-sm">
                          <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent className="mt-auto space-y-2 pt-3 sm:pt-4 border-t">
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Total Transaksi</span>
                        <span className="font-medium">{stats.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Total Belanja</span>
                        <span className="font-medium truncate">{formatCurrency(stats.totalSpent)}</span>
                    </div>
                    {stats.totalDebt > 0 && (
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Sisa Utang</span>
                        <span className="font-medium text-warning truncate">{formatCurrency(stats.totalDebt)}</span>
                      </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <CustomerForm customer={customer} onSuccess={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent className="max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-base">Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription className="text-sm">
                            Tindakan ini akan menghapus data pelanggan secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="text-xs sm:text-sm">Batal</AlertDialogCancel>
                        <AlertDialogAction 
                            className="bg-destructive hover:bg-destructive/90 text-xs sm:text-sm" 
                            onClick={() => customer?.id && deleteCustomer(customer.id)}
                        >
                            Hapus
                        </AlertDialogAction>
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
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground truncate">Pelanggan</h2>
                    <p className="text-sm text-muted-foreground mt-1">Kelola data pelanggan Anda</p>
                </div>
                <Button onClick={() => setDialogOpen(true)} size="sm" className="text-xs sm:text-sm flex-shrink-0">
                    <Plus className="mr-1 sm:mr-2 h-3 h-3 sm:h-4 w-3 sm:w-4" /> 
                    <span className="hidden sm:inline">Tambah Pelanggan</span>
                    <span className="sm:hidden">Tambah</span>
                </Button>
            </div>
            
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Cari nama pelanggan..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-10 text-sm sm:text-base"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredCustomers.length === 0 ? (
                    <div className="col-span-full text-center py-10">
                        <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm sm:text-base">Tidak ada pelanggan ditemukan.</p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                            {searchTerm ? "Coba kata kunci lain" : "Tambahkan pelanggan pertama Anda"}
                        </p>
                    </div>
                ) : (
                    filteredCustomers.map(customer => <CustomerCard key={customer.id} customer={customer} />)
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <CustomerForm onSuccess={() => setDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}