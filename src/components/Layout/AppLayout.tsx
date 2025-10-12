import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
}

export function AppLayout({ children, title, showSearch = false, onSearch }: AppLayoutProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar 
          open={sidebarOpen} 
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isMobile={false}
        />
      )}

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        !isMobile && (sidebarOpen ? "lg:ml-64" : "lg:ml-16")
      )}>
        {/* Header */}
        <Header 
          title={title}
          showSearch={showSearch}
          onSearch={onSearch}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          isMobile={isMobile}
        />

        {/* Page Content */}
        <main className={cn(
          "p-4 lg:p-6",
          isMobile ? "pt-16 pb-20" : "pt-20 lg:pt-24"
        )}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isMobile && <MobileNav />}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl">
          <Sidebar 
            open={true} 
            onToggle={() => setSidebarOpen(false)}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
}