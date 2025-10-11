import { NavLink } from "react-router-dom";
import { Home, Fish, Users, ShoppingCart, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/", label: "Dasbor", icon: Home },
  { path: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { path: "/stock", label: "Stok", icon: Fish },
  { path: "/customers", label: "Pelanggan", icon: Users },
  { path: "/reports", label: "Laporan", icon: BarChart3 },
];

export function Navigation() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let timeoutId: NodeJS.Timeout;
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 10);
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [lastScrollY]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 z-50 w-full bg-card border-t shadow-lg transition-transform duration-300 safe-bottom",
      isVisible ? "translate-y-0" : "translate-y-full"
    )}>
      <div className="grid h-16 grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center justify-center h-full w-full rounded-none group touch-target",
                    "active:scale-95 transition-all duration-150",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-label={item.label}
                >
                  <Icon className={cn(
                    "w-6 h-6 mb-1 transition-all duration-200",
                    isActive && "scale-110 drop-shadow-md"
                  )} />
                  <span className={cn(
                    "text-xs transition-all duration-200",
                    isActive && "font-semibold"
                  )}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Button>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
}