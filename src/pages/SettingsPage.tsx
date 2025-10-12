import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/db";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  DollarSign, 
  Package, 
  Clock, 
  Bell, 
  Palette, 
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Info
} from "lucide-react";

const settingsSchema = z.object({
  defaultShrinkagePercentage: z.coerce.number().nonnegative("Penyusutan tidak boleh negatif.").max(100, "Maksimal 100%"),
  defaultDailyPrice: z.coerce.number().positive("Harga jual harus positif."),
  businessName: z.string().min(1, "Nama usaha tidak boleh kosong"),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  currency: z.string().default("IDR"),
  timezone: z.string().default("Asia/Jakarta"),
  dateFormat: z.string().default("dd/MM/yyyy"),
  enableNotifications: z.boolean().default(true),
  enableAutoBackup: z.boolean().default(false),
  backupInterval: z.string().default("weekly"),
  theme: z.enum(["light", "dark", "auto"]).default("light"),
  language: z.string().default("id"),
  itemsPerPage: z.coerce.number().min(5).max(100).default(20),
  workingHoursStart: z.string().default("08:00"),
  workingHoursEnd: z.string().default("17:00"),
  enableDebtReminder: z.boolean().default(true),
  debtReminderDays: z.coerce.number().min(1).max(30).default(3),
});

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isResetting, setIsResetting] = useState(false);
  
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings || {
      defaultShrinkagePercentage: 5,
      defaultDailyPrice: 0,
      businessName: "Udangku Business",
      businessAddress: "",
      businessPhone: "",
      currency: "IDR",
      timezone: "Asia/Jakarta",
      dateFormat: "dd/MM/yyyy",
      enableNotifications: true,
      enableAutoBackup: false,
      backupInterval: "weekly",
      theme: "light",
      language: "id",
      itemsPerPage: 20,
      workingHoursStart: "08:00",
      workingHoursEnd: "17:00",
      enableDebtReminder: true,
      debtReminderDays: 3,
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  const handleSubmit = async (values: z.infer<typeof settingsSchema>) => {
    try {
      await updateSettings(values);
      toast({ 
        title: "✅ Pengaturan Disimpan",
        description: "Semua pengaturan telah berhasil diperbarui.",
      });
    } catch (error) {
      toast({ 
        title: "❌ Error",
        description: "Gagal menyimpan pengaturan: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleExportData = async () => {
    try {
      const backupData = {
        customers: await db.customers.toArray(),
        transactions: await db.transactions.toArray(),
        stockEntries: await db.stockEntries.toArray(),
        operationalCosts: await db.operationalCosts.toArray(),
        settings: await db.settings.toArray(),
        debts: await db.debts.toArray(),
        debtPayments: await db.debtPayments.toArray(),
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
        appName: 'Udangku Management System'
      };

      const dataStr = JSON.stringify(backupData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `udangku-backup-${new Date().toISOString().split('T')[0]}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ Backup Berhasil",
        description: "Semua data telah berhasil diekspor.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Gagal mengekspor data: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      let data: any;
      
      if (fileExtension === 'json') {
        data = JSON.parse(text);
      } else if (fileExtension === 'csv') {
        // Parse CSV data (simplified version)
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        data = {
          customers: [],
          transactions: [],
          stockEntries: [],
          operationalCosts: [],
          debts: [],
          debtPayments: []
        };
        
        // Parse customers
        if (headers.includes('customerName')) {
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const customer: any = {};
            headers.forEach((header, index) => {
              customer[header] = values[index];
            });
            
            data.customers.push({
              id: customer.customerId || Date.now() + i,
              name: customer.customerName,
              phone: customer.customerPhone || '',
              address: customer.customerAddress || '',
              createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : new Date().toISOString()
            });
          }
        }
      } else {
        toast({
          title: "❌ Format tidak didukung",
          description: "Gunakan file JSON atau CSV.",
          variant: "destructive",
        });
        return;
      }
      
      if (!confirm(`🔄 Import Data\n\nApakah Anda yakin ingin mengimpor:\n• ${data.customers?.length || 0} pelanggan\n• ${data.transactions?.length || 0} transaksi\n• ${data.stockEntries?.length || 0} entri stok\n• ${data.operationalCosts?.length || 0} biaya operasional?\n\n⚠️ Data yang ada akan ditimpa!`)) {
        return;
      }

      // Clear existing data
      await Promise.all([
        db.customers.clear(),
        db.transactions.clear(),
        db.stockEntries.clear(),
        db.operationalCosts.clear(),
        db.debts.clear(),
        db.debtPayments.clear()
      ]);

      // Import new data
      await Promise.all([
        db.customers.bulkAdd(data.customers || []),
        db.transactions.bulkAdd(data.transactions || []),
        db.stockEntries.bulkAdd(data.stockEntries || []),
        db.operationalCosts.bulkAdd(data.operationalCosts || []),
        db.debts.bulkAdd(data.debts || []),
        db.debtPayments.bulkAdd(data.debtPayments || [])
      ]);

      toast({
        title: "✅ Import Berhasil",
        description: "Data telah berhasil diimpor.",
      });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Gagal mengimpor data: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleResetData = async () => {
    if (!confirm("⚠️ PERINGATAN\n\nAnda yakin ingin menghapus SEMUA data?\n\nTindakan ini tidak dapat dibatalkan dan akan menghapus:\n• Semua pelanggan\n• Semua transaksi\n• Semua stok\n• Semua biaya operasional\n• Semua data utang\n\nLanjutkan?")) {
      return;
    }

    setIsResetting(true);
    try {
      await Promise.all([
        db.customers.clear(),
        db.transactions.clear(),
        db.stockEntries.clear(),
        db.operationalCosts.clear(),
        db.debts.clear(),
        db.debtPayments.clear()
      ]);

      toast({
        title: "✅ Data Dihapus",
        description: "Semua data telah berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Gagal menghapus data: " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetSettings = async () => {
    if (!confirm("⚠️ Reset Pengaturan\n\nAnda yakin ingin mengembalikan semua pengaturan ke nilai default?\n\nTindakan ini akan mengubah:\n• Nama usaha\n• Harga default\n• Tampilan dan tema\n• Semua preferensi aplikasi\n\nLanjutkan?")) {
      return;
    }

    try {
      await resetSettings();
      form.reset();
      toast({
        title: "✅ Pengaturan Direset",
        description: "Semua pengaturan telah dikembalikan ke nilai default.",
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Gagal mereset pengaturan: " + (error as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
          Pengaturan Aplikasi
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl">Kelola preferensi dan konfigurasi aplikasi sesuai kebutuhan Anda</p>
      </div>

      <Tabs defaultValue="general" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-7 gap-3 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 rounded-2xl border border-white/50 dark:border-gray-700 shadow-lg backdrop-blur-sm">
          <TabsTrigger value="general" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <Settings className="h-4 w-4 mr-2" />
            Umum
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:via-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <DollarSign className="h-4 w-4 mr-2" />
            Bisnis
          </TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <Palette className="h-4 w-4 mr-2" />
            Tampilan
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-pink-600 data-[state=active]:to-rose-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <Bell className="h-4 w-4 mr-2" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:via-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-green-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <Database className="h-4 w-4 mr-2" />
            Data
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:via-slate-600 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-500/25 rounded-xl transition-all duration-300 font-semibold py-3">
            <Clock className="h-4 w-4 mr-2" />
            Lanjutan
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* General Settings */}
            <TabsContent value="general" className="space-y-6 mt-0">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    Pengaturan Umum
                  </CardTitle>
                  <CardDescription className="text-base">Konfigurasi dasar aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="businessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-base font-semibold">
                            <Info className="h-5 w-5 text-blue-500" />
                            Nama Usaha
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: Udangku Sejahtera" 
                              className="border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 rounded-xl py-3 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Telepon Usaha</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Contoh: 081234567890" 
                              className="border-2 focus:border-blue-500 focus:ring-blue-500/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alamat Usaha</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Masukkan alamat lengkap usaha Anda" 
                            className="border-2 focus:border-blue-500 focus:ring-blue-500/20 min-h-[80px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business Settings */}
            <TabsContent value="business" className="space-y-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Pengaturan Bisnis
                  </CardTitle>
                  <CardDescription>Konfigurasi harga dan operasional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="defaultDailyPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harga Jual Default per Hari</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50000" 
                              className="border-2 focus:border-green-500 focus:ring-green-500/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="defaultShrinkagePercentage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Penyusutan Default (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="5" 
                              className="border-2 focus:border-green-500 focus:ring-green-500/20" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mata Uang</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 focus:border-green-500 focus:ring-green-500/20">
                                <SelectValue placeholder="Pilih mata uang" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IDR">🇮🇩 IDR (Rupiah)</SelectItem>
                              <SelectItem value="USD">🇺🇸 USD (Dollar)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zona Waktu</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 focus:border-green-500 focus:ring-green-500/20">
                                <SelectValue placeholder="Pilih zona waktu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Asia/Jakarta">🇮🇩 Jakarta (WIB)</SelectItem>
                              <SelectItem value="Asia/Makassar">🇮🇩 Makassar (WITA)</SelectItem>
                              <SelectItem value="Asia/Jayapura">🇮🇩 Jayapura (WIT)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    Tampilan & Tema
                  </CardTitle>
                  <CardDescription>Personalizasi tampilan aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="theme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tema Aplikasi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 focus:border-purple-500 focus:ring-purple-500/20">
                                <SelectValue placeholder="Pilih tema" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="light">☀️ Terang</SelectItem>
                              <SelectItem value="dark">🌙 Gelap</SelectItem>
                              <SelectItem value="auto">🔄 Otomatis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bahasa</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 focus:border-purple-500 focus:ring-purple-500/20">
                                <SelectValue placeholder="Pilih bahasa" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="id">🇮🇩 Bahasa Indonesia</SelectItem>
                              <SelectItem value="en">🇬🇧 English</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="itemsPerPage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item per Halaman</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="5" 
                            max="100" 
                            placeholder="20" 
                            className="border-2 focus:border-purple-500 focus:ring-purple-500/20 w-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format Tanggal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 focus:border-purple-500 focus:ring-purple-500/20">
                              <SelectValue placeholder="Pilih format tanggal" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="dd/MM/yyyy">🇮🇩 31/12/2024</SelectItem>
                            <SelectItem value="MM/dd/yyyy">🇺🇸 12/31/2024</SelectItem>
                            <SelectItem value="yyyy-MM-dd">📊 2024-12-31</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Notifikasi & Pengingat
                  </CardTitle>
                  <CardDescription>Kelola notifikasi dan pengingat aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="enableNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Notifikasi Aktif</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Aktifkan notifikasi untuk update penting
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="enableDebtReminder"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Pengingat Utang</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Ingatkan pelanggan tentang utang yang jatuh tempo
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="enableAutoBackup"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Backup Otomatis</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Otomatis backup data secara berkala
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {form.watch("enableAutoBackup") && (
                    <FormField
                      control={form.control}
                      name="backupInterval"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Interval Backup</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-2 focus:border-orange-500 focus:ring-orange-500/20">
                                <SelectValue placeholder="Pilih interval" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="daily">📅 Harian</SelectItem>
                              <SelectItem value="weekly">📆 Mingguan</SelectItem>
                              <SelectItem value="monthly">🗓️ Bulanan</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="debtReminderDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hari Pengingat Utang (sebelum jatuh tempo)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="1" 
                            max="30" 
                            placeholder="3" 
                            className="border-2 focus:border-orange-500 focus:ring-orange-500/20 w-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-6 mt-0">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/20 rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-indigo-500/5 to-blue-500/5">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Database className="h-6 w-6 text-indigo-600" />
                    </div>
                    Manajemen Data
                  </CardTitle>
                  <CardDescription className="text-base">Backup, restore, dan kelola data aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Button
                      type="button"
                      onClick={handleExportData}
                      className="h-16 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 hover:from-green-600 hover:via-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Download className="h-6 w-6 mr-3" />
                      <div className="text-left">
                        <div className="font-bold text-lg">Export Data</div>
                        <div className="text-sm opacity-90">Backup semua data</div>
                      </div>
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-16 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Upload className="h-6 w-6 mr-3" />
                      <div className="text-left">
                        <div className="font-bold text-lg">Import Data</div>
                        <div className="text-sm opacity-90">Restore dari backup</div>
                      </div>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <Trash2 className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-red-900 mb-2 text-lg">Area Berbahaya</h4>
                        <p className="text-red-700 mb-4">
                          Tindakan di area ini tidak dapat dibatalkan. Pastikan Anda telah membackup data sebelum melanjutkan.
                        </p>
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={handleResetData}
                          disabled={isResetting}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl py-3 px-6 font-semibold"
                        >
                          {isResetting ? (
                            <>
                              <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                              Menghapus...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-5 w-5 mr-2" />
                              Hapus Semua Data
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    id="import-file-input"
                    aria-label="Import file input"
                    type="file"
                    accept=".json,.csv"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6 mt-0">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white via-slate-50/30 to-gray-50/20 rounded-2xl overflow-hidden">
                <CardHeader className="pb-6 bg-gradient-to-r from-slate-500/5 to-gray-500/5">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <Clock className="h-6 w-6 text-slate-600" />
                    </div>
                    Pengaturan Lanjutan
                  </CardTitle>
                  <CardDescription className="text-base">Konfigurasi tambahan untuk pengguna ahli</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="workingHoursStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Jam Kerja Mulai</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              className="border-2 border-gray-200 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/20 transition-all duration-200 rounded-xl py-3 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="workingHoursEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold">Jam Kerja Selesai</FormLabel>
                          <FormControl>
                            <Input 
                              type="time" 
                              className="border-2 border-gray-200 focus:border-slate-500 focus:ring-4 focus:ring-slate-500/20 transition-all duration-200 rounded-xl py-3 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 rounded-xl">
                        <RefreshCw className="h-6 w-6 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-amber-900 mb-2 text-lg">Reset Pengaturan</h4>
                        <p className="text-amber-700 mb-4">
                          Kembalikan semua pengaturan ke nilai default pabrik. Tindakan ini akan mengubah semua preferensi aplikasi.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleResetSettings}
                          className="border-2 border-amber-500 text-amber-600 hover:bg-amber-100 hover:text-amber-700 rounded-xl py-3 px-6 font-semibold"
                        >
                          <RefreshCw className="h-5 w-5 mr-2" />
                          Reset ke Default
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Form>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-6 z-10">
        <Button
          onClick={form.handleSubmit(handleSubmit)}
          className="bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 hover:from-blue-600 hover:via-blue-700 hover:to-purple-700 text-white font-semibold px-8 h-14 rounded-2xl shadow-2xl hover:shadow-blue-500/25 hover:shadow-purple-500/25 transition-all duration-300 backdrop-blur-sm border border-white/20"
        >
          <Save className="h-5 w-5 mr-2" />
          Simpan Semua Perubahan
        </Button>
      </div>
    </div>
  );
}