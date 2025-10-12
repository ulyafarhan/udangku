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
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const navItems = [
  { path: "/", label: "Dasbor", icon: Home },
  { path: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { path: "/stock", label: "Stok", icon: Fish },
  { path: "/customers", label: "Pelanggan", icon: Users },
  { path: "/debt", label: "Hutang", icon: CreditCard },
  { path: "/reports", label: "Laporan", icon: BarChart3 },
  { path: "/settings", label: "Pengaturan", icon: Settings },
];

export function Sidebar({ open, onToggle, isMobile }: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isMobile]);

  const shouldShowLabels = open || isHovered;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        id="sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-gradient-to-b from-slate-900 to-slate-800",
          "border-r border-slate-700 shadow-2xl transition-all duration-300",
          isMobile 
            ? cn(
                "w-64 transform transition-transform",
                open ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                open ? "w-64" : "w-16 hover:w-64",
                "hover:shadow-2xl group"
              )
        )}
      >
        {/* Logo/Header */}
        <div className={cn(
          "flex items-center justify-between p-4 border-b border-slate-700",
          !isMobile && !open && !isHovered && "justify-center"
        )}>
          <div className={cn(
            "flex items-center gap-3 transition-opacity duration-300",
            shouldShowLabels ? "opacity-100" : "opacity-0 lg:opacity-100"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <Fish className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">UdangKu</span>
          </div>
          
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && onToggle()}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200",
                  "text-slate-300 hover:text-white hover:bg-slate-700/50",
                  "group relative overflow-hidden",
                  isActive 
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg" 
                    : "hover:translate-x-1"
                )
              }
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon className={cn(
                      "w-5 h-5 transition-all duration-200",
                      isActive && "scale-110"
                    )} />
                    <span className={cn(
                      "transition-all duration-300 font-medium",
                      shouldShowLabels ? "opacity-100" : "opacity-0 lg:w-0 lg:overflow-hidden"
                    )}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full" />
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {!shouldShowLabels && !isMobile && (
                      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className={cn(
            "flex items-center gap-3",
            shouldShowLabels ? "justify-start" : "justify-center lg:justify-start"
          )}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">U</span>
            </div>
            <div className={cn(
              "transition-all duration-300",
              shouldShowLabels ? "opacity-100" : "opacity-0 lg:w-0 lg:overflow-hidden"
            )}>
              <p className="text-white font-medium text-sm">Admin</p>
              <p className="text-slate-400 text-xs">udangku.app</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}