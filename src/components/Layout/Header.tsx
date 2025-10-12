import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Menu, 
  Bell, 
  Settings,
  User,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  isMobile: boolean;
}

export function Header({ title, showSearch = false, onSearch, onMenuClick, isMobile }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedDarkMode ? savedDarkMode === 'true' : systemPrefersDark;
    
    setDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-40",
      "bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg",
      "border-b border-slate-200 dark:border-slate-700",
      "transition-all duration-300"
    )}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="text-slate-600 dark:text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {title || 'UdangKu'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistem Manajemen Udang
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari transaksi, pelanggan, atau stok..."
                value={searchQuery}
                onChange={handleSearch}
                className={cn(
                  "pl-10 pr-4 py-2 w-full rounded-xl",
                  "bg-slate-100 dark:bg-slate-800",
                  "border-0 focus:ring-2 focus:ring-blue-500",
                  "placeholder:text-slate-400 dark:placeholder:text-slate-500"
                )}
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-600 dark:text-slate-300"
              >
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Stok udang hampir habis</p>
                  <p className="text-sm text-slate-500">Sisa 5kg udang medium</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Pembayaran jatuh tempo</p>
                  <p className="text-sm text-slate-500">3 hutang akan jatuh tempo</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-600 dark:text-slate-300"
              >
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Settings className="w-4 h-4" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-red-600">
                <LogOut className="w-4 h-4" />
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}