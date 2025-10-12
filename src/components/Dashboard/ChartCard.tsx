import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  period?: string;
  className?: string;
  onRefresh?: () => void;
}

export function ChartCard({ title, children, trend, period = "7 hari terakhir", className, onRefresh }: ChartCardProps) {
  return (
    <Card className={cn(
      "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700",
      "shadow-lg hover:shadow-xl transition-all duration-300",
      "rounded-2xl overflow-hidden",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {period}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-medium",
              trend.isPositive 
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
          
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              ↻
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[300px] w-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}