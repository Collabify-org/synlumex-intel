import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type Props = {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; direction: 'up' | 'down' | 'flat'; positive?: boolean };
  className?: string;
  accent?: boolean;
};

export function KpiCard({ icon: Icon, label, value, sub, trend, className, accent }: Props) {
  const trendColor =
    trend?.direction === 'flat'
      ? 'text-muted-foreground bg-muted/50'
      : trend?.positive
        ? 'text-cyan-400 bg-cyan-500/10'
        : 'text-red-400 bg-red-500/10';

  return (
    <Card
      className={cn(
        'p-5 bg-card/50 border-border relative overflow-hidden',
        accent && 'border-brand-cyan/30',
        className
      )}
    >
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-brand-cyan/5 pointer-events-none" />
      )}
      <div className="flex items-start justify-between mb-4 relative">
        <div
          className={cn(
            'h-8 w-8 rounded-md flex items-center justify-center',
            accent ? 'brand-gradient text-white' : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <span className={cn('text-[10px] font-mono px-2 py-1 rounded', trendColor)}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'}{' '}
            {trend.value}
          </span>
        )}
      </div>
      <div className="relative">
        <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase mb-2">
          {label}
        </div>
        <div
          className={cn(
            'font-semibold tracking-tight',
            accent ? 'text-3xl brand-gradient-text' : 'text-2xl'
          )}
        >
          {value}
        </div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
    </Card>
  );
}
