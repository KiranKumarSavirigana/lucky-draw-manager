import { cn } from '@/lib/utils';

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = 'default' }) {
  return (
    <div className={cn(
      'relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-md animate-slide-up',
      variant === 'gold' && 'border-accent/30',
      variant === 'primary' && 'border-primary/30'
    )}>
      {variant === 'gold' && (
        <div className="absolute top-0 right-0 w-32 h-32 gradient-gold opacity-10 blur-2xl" />
      )}
      {variant === 'primary' && (
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 blur-2xl" />
      )}
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              'text-xs font-medium',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : ''}{trend.value}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl',
          variant === 'gold' ? 'gradient-gold' : variant === 'primary' ? 'gradient-primary' : 'bg-secondary'
        )}>
          <Icon className={cn(
            'h-6 w-6',
            variant === 'default' ? 'text-primary' : 'text-foreground'
          )} />
        </div>
      </div>
    </div>
  );
}
