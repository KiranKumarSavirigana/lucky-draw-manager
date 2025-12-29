import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProgramOverview({ programs }) {
  const getStatusBadgeVariant = (status) => {
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
          <p className="text-sm text-muted-foreground">Your ongoing lucky draw programs</p>
        </div>
        <Calendar className="h-5 w-5 text-primary" />
      </div>
      <div className="divide-y divide-border">
        {programs.slice(0, 4).map((program) => (
          <Link
            key={program.id}
            to={`/programs/${program.id}/events`}
            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{program.name}</p>
              <p className="text-sm text-muted-foreground truncate">{program.description}</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <Badge variant={getStatusBadgeVariant(program.status)}>
                {program.status}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
