import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { OfflineNotification } from "./components/OfflineNotification";
import { DashboardPage } from "./pages/DashboardPage";
import { TransactionPage } from "./pages/TransactionPage";
import { StockPage } from "./pages/StockPage";
import { CustomerPage } from "./pages/CustomerPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { DebtPage } from "./pages/DebtPage";
import { AppLayout } from "./components/Layout/AppLayout";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./components/LoadingSpinner";

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
      <div className="min-h-screen">
        <OfflineNotification />
        <Routes>
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/stock" element={<StockPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/debt" element={<DebtPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
        <Toaster />
      </div>
    </HashRouter>
  );
}

export default App;