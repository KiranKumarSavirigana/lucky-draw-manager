import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LuckyDrawProgram } from '@/types/luckyDraw';
import { Calendar, ChevronRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProgramOverviewProps {
  programs: LuckyDrawProgram[];
}

export function ProgramOverview({ programs }: ProgramOverviewProps) {
  const getStatusBadgeVariant = (status: LuckyDrawProgram['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'secondary';
      case 'draft':
        return 'muted';
      default:
        return 'muted';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card animate-slide-up">
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="font-semibold text-lg">Active Programs</h3>
          <p className="text-sm text-muted-foreground">Manage your lucky draw events</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to="/programs">View All</Link>
        </Button>
      </div>
      <div className="divide-y divide-border">
        {programs.slice(0, 3).map((program) => (
          <Link
            key={program.id}
            to={`/programs/${program.id}`}
            className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50 group"
          >
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-xl',
              program.status === 'active' ? 'gradient-gold' : 'bg-secondary'
            )}>
              <Calendar className={cn(
                'h-5 w-5',
                program.status === 'active' ? 'text-foreground' : 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{program.name}</p>
                <Badge variant={getStatusBadgeVariant(program.status)}>
                  {program.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(program.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {program.totalWinners} winners
                </span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
