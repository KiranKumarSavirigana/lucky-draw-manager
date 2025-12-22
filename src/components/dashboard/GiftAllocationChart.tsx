import { Gift } from '@/types/luckyDraw';
import { Gift as GiftIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftAllocationChartProps {
  gifts: Gift[];
}

export function GiftAllocationChart({ gifts }: GiftAllocationChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card animate-slide-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">Gift Allocation</h3>
          <p className="text-sm text-muted-foreground">Track gift distribution status</p>
        </div>
        <GiftIcon className="h-5 w-5 text-primary" />
      </div>
      <div className="p-6 space-y-4">
        {gifts.slice(0, 5).map((gift) => {
          const percentage = gift.quantity > 0 ? (gift.assignedCount / gift.quantity) * 100 : 0;
          const isFullyAllocated = gift.assignedCount >= gift.quantity;
          
          return (
            <div key={gift.id} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate max-w-[200px]">{gift.name}</span>
                <span className="text-muted-foreground">
                  {gift.assignedCount}/{gift.quantity}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isFullyAllocated ? 'bg-success' : 'gradient-primary'
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
