import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

export function RecentWinners({ winners }) {
  const getRankBadgeVariant = (rank) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'warning';
    return 'muted';
  };

  const getStatusBadgeVariant = (status) => {
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
        {winners.slice(0, 5).map((winner) => (
          <div key={winner.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4">
              <Badge variant={getRankBadgeVariant(winner.rank)} className="w-12 justify-center font-bold">
                #{winner.rank}
              </Badge>
              <div>
                <p className="font-medium">{winner.name}</p>
                <p className="text-sm text-muted-foreground">{winner.mobileNumber}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{winner.giftName}</p>
                <Badge variant={getStatusBadgeVariant(winner.status)} className="mt-1">
                  {winner.status}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
