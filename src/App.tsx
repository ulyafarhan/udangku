import { HashRouter, Route, Routes } from "react-router-dom";
import { StockPage } from "./pages/StockPage";
import { CustomerPage } from "./pages/CustomerPage";
import { TransactionPage } from "./pages/TransactionPage"; // <- Tambahkan ini
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-surface-gradient">
        <main className="container mx-auto px-4 py-6 pb-24">
          <Routes>
            {/* Arahkan halaman utama ke Dasbor (untuk nanti) atau Transaksi untuk sekarang */}
            <Route path="/" element={<TransactionPage />} /> 
            <Route path="/transactions" element={<TransactionPage />} /> {/* <- Tambahkan ini */}
            <Route path="/stock" element={<StockPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            {/* Rute lain akan ditambahkan di sini */}
          </Routes>
        </main>
        <Navigation />
      </div>
    </HashRouter>
  )
}

export default App;