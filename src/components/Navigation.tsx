import { NavLink } from "react-router-dom";
import { Home, Fish, Users, ShoppingCart, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dasbor", icon: Home },
  { path: "/transactions", label: "Transaksi", icon: ShoppingCart },
  { path: "/stock", label: "Stok", icon: Fish },
  { path: "/customers", label: "Pelanggan", icon: Users },
  { path: "/reports", label: "Laporan", icon: BarChart3 },
];

export function Navigation() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t shadow-lg">
      <div className="grid h-full grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path}>
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center justify-center h-full w-full rounded-none group",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className={cn("w-6 h-6 mb-1 transition-transform", isActive && "scale-110")} />
                  <span className={cn("text-xs", isActive && "font-semibold")}>
                    {item.label}
                  </span>
                </Button>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
}