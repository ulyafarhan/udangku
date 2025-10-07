import { HashRouter, Route, Routes } from "react-router-dom";
import { StockPage } from "./pages/StockPage";
import { CustomerPage } from "./pages/CustomerPage";
import { TransactionPage } from "./pages/TransactionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage"; // <-- Impor baru
import { Navigation } from "./components/Navigation";

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-surface-gradient">
        <main className="container mx-auto px-4 py-6 pb-24">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
            <Route path="/stock" element={<StockPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} /> 
          </Routes>
        </main>
        <Navigation />
      </div>
    </HashRouter>
  )
}

export default App;