import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { OfflineNotification } from "@/components/OfflineNotification";
import { DashboardPage } from "@/pages/DashboardPage";
import { TransactionPage } from "@/pages/TransactionPage";
import { StockPage } from "@/pages/StockPage";
import { CustomerPage } from "@/pages/CustomerPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/LoadingSpinner";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen text="Memuat UdangKu..." />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-background pb-20">
        <OfflineNotification />
        <main className="container mx-auto px-4 py-6 max-w-7xl">
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
        <Toaster />
      </div>
    </HashRouter>
  );
}

export default App;