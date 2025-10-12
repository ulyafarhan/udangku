import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { useStock } from "@/hooks/useStock";
import { useOperationalCosts } from "@/hooks/useOperationalCosts";
import { stockColumns, costColumns } from "./StockPage/columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StockPage() {
  const { stockEntries } = useStock();
  const { costs } = useOperationalCosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Stok & Biaya</h2>
          <p className="text-muted-foreground">
            Kelola stok udang masuk dan biaya operasional Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Udang Masuk
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Catat Biaya
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Stok Masuk</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={stockColumns} data={stockEntries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Biaya Operasional</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable columns={costColumns} data={costs} />
          </CardContent>
        </Card>
      </div>

      {/* TODO: Implement Dialogs for adding/editing entries */}
    </div>
  );
}