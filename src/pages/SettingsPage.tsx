import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSettings } from "@/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";

const settingsSchema = z.object({
  defaultShrinkagePercentage: z.coerce.number().nonnegative("Penyusutan tidak boleh negatif."),
  defaultDailyPrice: z.coerce.number().positive("Harga jual harus positif."),
});

export function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
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
          title: "Pengaturan Disimpan",
          description: "Nilai default telah berhasil diperbarui.",
      });
    } catch (error) {
      toast({ 
          title: "Error",
          description: "Gagal menyimpan pengaturan: " + (error as Error).message,
          variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Pengaturan</h2>
        <p className="text-muted-foreground">Atur preferensi default untuk aplikasi.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Default Form</CardTitle>
            <CardDescription>Nilai ini akan digunakan sebagai isian awal pada form Stok dan Transaksi.</CardDescription>
        </CardHeader>
        <CardContent>
          {settings && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 max-w-2xl">
                <FormField
                  control={form.control}
                  name="defaultShrinkagePercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Penyusutan Stok (%)</FormLabel>
                      <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultDailyPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Harga Jual Harian (Rp/kg)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Simpan Pengaturan</Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};