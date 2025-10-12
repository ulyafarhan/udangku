import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  className?: string;
}

const colorVariants = {
  blue: 'from-blue-500 to-cyan-400',
  green: 'from-green-500 to-emerald-400',
  orange: 'from-orange-500 to-amber-400',
  red: 'from-red-500 to-rose-400',
  purple: 'from-purple-500 to-violet-400',
};

const iconBgVariants = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  red: 'bg-red-100 text-red-600',
  purple: 'bg-purple-100 text-purple-600',
};

export function StatCard({ title, value, icon: Icon, trend, color = 'blue', className }: StatCardProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl sm:rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6",
      "shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95",
      "border border-slate-200 dark:border-slate-700",
      className
    )}>
      {/* Gradient Background */}
      <div className={cn(
        "absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10",
        "bg-gradient-to-br rounded-full -translate-y-12 -translate-x-4 sm:-translate-y-16 sm:translate-x-16",
        colorVariants[color]
      )} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={cn(
            "p-2 sm:p-3 rounded-lg sm:rounded-xl",
            iconBgVariants[color]
          )}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          
          {trend && (
            <Badge
              variant={trend.isPositive ? "default" : "destructive"}
              className={cn(
                "text-xs font-medium flex-shrink-0 ml-2",
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}
            >
              {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white break-all">
            {value}
          </p>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-0.5 sm:h-1",
        "bg-gradient-to-r",
        colorVariants[color]
      )} />
    </div>
  );
}