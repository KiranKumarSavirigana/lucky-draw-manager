import { Badge } from '@/components/ui/badge';
import { Winner } from '@/types/luckyDraw';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentWinnersProps {
  winners: Winner[];
}

export function RecentWinners({ winners }: RecentWinnersProps) {
  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'warning';
    return 'muted';
  };

  const getStatusBadgeVariant = (status: Winner['status']) => {
    switch (status) {
      case 'locked':
        return 'success';
      case 'assigned':
        return 'default';
      case 'pending':
        return 'warning';
      default:
        return 'muted';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card animate-slide-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">Recent Winners</h3>
          <p className="text-sm text-muted-foreground">Latest lucky draw results</p>
        </div>
        <Trophy className="h-5 w-5 text-accent" />
      </div>
      <div className="divide-y divide-border">
        {winners.slice(0, 5).map((winner, index) => (
          <div
            key={winner.id}
            className={cn(
              'flex items-center gap-4 p-4 transition-colors hover:bg-muted/50',
              index === 0 && 'bg-accent/5'
            )}
          >
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm',
              winner.rank === 1 ? 'gradient-gold text-foreground' : 'bg-secondary text-secondary-foreground'
            )}>
              #{winner.rank}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{winner.name}</p>
              <p className="text-sm text-muted-foreground truncate">{winner.mobileNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary truncate max-w-[120px]">
                {winner.giftName || 'No gift'}
              </p>
              <Badge variant={getStatusBadgeVariant(winner.status)} className="mt-1">
                {winner.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
