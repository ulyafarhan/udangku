// src/pages/ReportsPage.tsx
// Untuk saat ini, kita akan membuat halaman placeholder sederhana.
// Fungsionalitas filter tanggal dan ekspor akan ditambahkan di modul selanjutnya.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Laporan</h2>
            <Card>
                <CardHeader><CardTitle>Segera Hadir</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Fitur laporan detail, filter berdasarkan tanggal, dan ekspor data akan segera tersedia di sini.</p>
                </CardContent>
            </Card>
        </div>
    );
}