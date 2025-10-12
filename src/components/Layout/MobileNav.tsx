import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  ShoppingCart, 
  Fish, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { path: "/", label: "Dasbor", icon: Home },
  { path: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { path: "/stock", label: "Stok", icon: Fish },
  { path: "/customers", label: "Pelanggan", icon: Users },
  { path: "/debt", label: "Hutang", icon: CreditCard },
  { path: "/reports", label: "Laporan", icon: BarChart3 },
  { path: "/settings", label: "Pengaturan", icon: Settings },
];

export function MobileNav() {
  const [activeTab, setActiveTab] = useState("/");

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden pb-safe">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-4 h-16">
            {navItems.slice(0, 4).map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 relative px-1",
                    "transition-all duration-200 active:scale-95",
                    isActive 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  )
                }
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <div className={cn(
                        "relative transition-all duration-200",
                        isActive && "scale-110"
                      )}>
                        <Icon className="w-5 h-5" />
                        {isActive && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-medium transition-all duration-200 line-clamp-1",
                        isActive && "font-semibold"
                      )}>
                        {item.label}
                      </span>
                    </>
                  );
                }}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-30 lg:hidden">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>
    </>
  );
}