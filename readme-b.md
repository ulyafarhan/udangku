# UdangKu - Aplikasi PWA Manajemen Tambak Udang

![UdangKu Banner](https://via.placeholder.com/1200x630/1E90FF/FFFFFF?text=Aplikasi+Manajemen+UdangKu)

**UdangKu** adalah sebuah *Progressive Web App* (PWA) modern, intuitif, dan handal yang dirancang khusus untuk membantu petambak udang skala kecil hingga menengah dalam mengelola bisnis mereka secara efisien. Aplikasi ini 100% berjalan secara *offline* dan menyimpan semua data dengan aman di perangkat pengguna.

## Visi Proyek

Menjadi alat digital andalan bagi petambak udang di Indonesia, memberdayakan mereka dengan manajemen bisnis yang sederhana dan dapat diakses di mana saja, bahkan tanpa koneksi internet.

## ✨ Fitur Utama

Aplikasi ini mencakup seluruh siklus bisnis petambak udang, dari manajemen stok hingga laporan keuangan.

* 📊 **Dasbor Real-time:**
    * Pantau metrik kunci secara visual: **Pendapatan**, **Pengeluaran**, **Laba Bersih**, dan **Stok Tersedia**.
    * Lihat ringkasan **Piutang Tertunggak** dan **Jumlah Pelanggan**.
    * Akses cepat ke daftar **Transaksi Terbaru**.

* 🛒 **Manajemen Transaksi (CRUD Cerdas):**
    * Formulir tunggal untuk mencatat penjualan.
    * **Otomatis membuat pelanggan baru** jika nama tidak ditemukan, mempercepat alur kerja.
    * Dukungan untuk pembayaran **Tunai**, **Utang**, dan **Cicil** dengan kalkulasi sisa utang otomatis.
    * Riwayat transaksi yang mudah dicari dan difilter.

* 📦 **Manajemen Stok & Biaya (CRUD):**
    * Catat pemasukan stok udang baru dari pemasok.
    * Input berat kotor, harga beli, dan persentase penyusutan.
    * **Stok otomatis berkurang** setelah setiap penjualan.
    * Catat semua biaya operasional lainnya (pakan, bensin, es batu, dll).

* 👥 **Manajemen Pelanggan & Pemasok (CRUD):**
    * Database terpusat untuk semua kontak pelanggan dan pemasok.
    * Lihat ringkasan cepat **total transaksi** dan **sisa utang** untuk setiap pelanggan.

* 📄 **Laporan & Ekspor:**
    * Analisis performa bisnis dengan filter berdasarkan rentang tanggal.
    * **Ekspor data** laporan dalam format JSON untuk pencadangan atau analisis lebih lanjut.

* ⚙️ **Pengaturan Aplikasi:**
    * Sesuaikan nilai *default* seperti persentase penyusutan dan harga jual harian untuk mempercepat input data.

* 📱 **Offline & Installable (PWA):**
    * Berfungsi 100% tanpa koneksi internet.
    * Dapat di-"instal" di layar utama ponsel untuk pengalaman seperti aplikasi asli.

## 🚀 Teknologi yang Digunakan

Aplikasi ini dibangun dengan *stack* teknologi modern yang fokus pada kecepatan pengembangan dan pengalaman pengguna terbaik.

| Kategori | Teknologi | Alasan Pemilihan |
| :--- | :--- | :--- |
| **Database Offline** | **IndexedDB + Dexie.js** | Kapasitas besar, cepat, dan mudah digunakan untuk data kompleks. |
| **Build Tool** | **Vite** | Kecepatan pengembangan *real-time* yang luar biasa. |
| **Framework** | **React + TypeScript** | Kombinasi kuat dan aman untuk membangun antarmuka pengguna yang modern. |
| **UI & Desain** | **Tailwind CSS + Shadcn/UI** | Pembangunan UI yang sangat cepat dengan hasil profesional dan responsif. |
| **Fungsionalitas PWA** | **Vite PWA Plugin** | Mengubah aplikasi menjadi PWA secara otomatis dan efisien. |

## 🏁 Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda.

**Prasyarat:**
* Node.js (v18 atau lebih baru)
* npm / yarn / pnpm

**Instalasi:**

1.  **Clone repositori ini:**
    ```bash
    git clone [URL_GIT_ANDA]
    cd udangku
    ```

2.  **Instal semua dependensi:**
    ```bash
    npm install
    ```

3.  **Jalankan server pengembangan:**
    ```bash
    npm run dev
    ```
    Aplikasi sekarang akan berjalan di `http://localhost:5173`.

**Script Lainnya:**

* **Build untuk produksi:**
    ```bash
    npm run build
    ```

* **Pratinjau versi produksi:**
    ```bash
    npm run preview
    ```

## 📂 Struktur Folder Proyek

```
udangku/
├── public/               # Aset statis dan ikon PWA
├── src/
│   ├── components/       # Komponen UI yang dapat digunakan kembali (Form, Navigasi, dll)
│   │   └── ui/           # Komponen dari Shadcn/UI
│   ├── hooks/            # Logika bisnis (interaksi database)
│   ├── pages/            # Komponen untuk setiap halaman utama (Dasbor, Stok, dll)
│   ├── types/            # Definisi tipe data (interface)
│   ├── App.tsx           # Komponen utama dan routing aplikasi
│   ├── db.ts             # Konfigurasi database Dexie.js
│   └── main.tsx          # Titik masuk aplikasi
├── package.json          # Daftar dependensi dan skrip
└── vite.config.ts        # Konfigurasi Vite & PWA
```

##  roadmap Pengembangan

Meskipun fungsionalitas inti sudah ada, berikut adalah beberapa ide untuk pengembangan di masa depan:
* [ ] **Fitur Impor Data:** Kemampuan untuk mengimpor data dari file JSON atau CSV.
* [ ] **Grafik & Visualisasi:** Menambahkan grafik di halaman Laporan untuk analisis visual.
* [ ] **Manajemen Utang:** Halaman khusus untuk melacak dan mengelola pembayaran utang pelanggan.
* [ ] **Pencadangan Data (Opsional):** Fitur untuk mengekspor seluruh database ke satu file untuk dicadangkan secara manual oleh pengguna.
* [ ] **Tema Gelap/Terang Otomatis.**