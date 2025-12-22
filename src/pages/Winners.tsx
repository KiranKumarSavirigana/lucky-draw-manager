import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockWinners, mockPrograms, mockEvents } from '@/data/mockData';
import { Winner } from '@/types/luckyDraw';
import { Search, Lock, Unlock, Download, Phone, Gift } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function Winners() {
  const [winners, setWinners] = useState<Winner[]>(mockWinners);
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get filtered events based on selected program
  const filteredEventOptions = programFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.programId === programFilter);

  const filteredWinners = winners.filter((winner) => {
    const matchesSearch =
      winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      winner.mobileNumber.includes(searchQuery);
    const matchesProgram = programFilter === 'all' || winner.programId === programFilter;
    const matchesEvent = eventFilter === 'all' || winner.eventId === eventFilter;
    const matchesStatus = statusFilter === 'all' || winner.status === statusFilter;
    return matchesSearch && matchesProgram && matchesEvent && matchesStatus;
  });

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

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return { label: '1st', variant: 'gold' as const };
    if (rank === 2) return { label: '2nd', variant: 'secondary' as const };
    if (rank === 3) return { label: '3rd', variant: 'warning' as const };
    return { label: `${rank}th`, variant: 'muted' as const };
  };

  const getEventName = (eventId: string) => {
    const event = mockEvents.find(e => e.id === eventId);
    return event?.name || '-';
  };

  const getProgramName = (programId: string) => {
    const program = mockPrograms.find(p => p.id === programId);
    return program?.name || '-';
  };

  const handleToggleLock = (winnerId: string) => {
    setWinners(
      winners.map((w) => {
        if (w.id === winnerId) {
          const newStatus = w.status === 'locked' ? 'assigned' : 'locked';
          toast({
            title: newStatus === 'locked' ? 'Winner Locked' : 'Winner Unlocked',
            description: `${w.name}'s record has been ${newStatus}.`,
          });
          return { ...w, status: newStatus as Winner['status'] };
        }
        return w;
      })
    );
  };

  const handleExport = () => {
    const csv = [
      ['Rank', 'Name', 'Mobile', 'Employee ID', 'Customer ID', 'Program', 'Event', 'Gift', 'Status'].join(','),
      ...filteredWinners.map((w) =>
        [w.rank, w.name, w.mobileNumber, w.employeeId || '', w.customerId || '', getProgramName(w.programId), getEventName(w.eventId), w.giftName || '', w.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-winners-list.csv';
    a.click();
    toast({
      title: 'Export Complete',
      description: 'Winners list has been downloaded.',
    });
  };

  // Reset event filter when program changes
  const handleProgramFilterChange = (value: string) => {
    setProgramFilter(value);
    setEventFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Winners</h1>
          <p className="text-muted-foreground">View all lucky draw winners across programs and events</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or mobile..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={programFilter} onValueChange={handleProgramFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by program" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Programs</SelectItem>
            {mockPrograms.map((program) => (
              <SelectItem key={program.id} value={program.id}>
                {program.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Events</SelectItem>
            {filteredEventOptions.map((event) => (
              <SelectItem key={event.id} value={event.id}>
                {event.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="assigned">Assigned</SelectItem>
            <SelectItem value="locked">Locked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Winners Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-20">Rank</TableHead>
              <TableHead>Winner</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Program / Event</TableHead>
              <TableHead>Gift</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWinners.map((winner) => {
              const rankDisplay = getRankDisplay(winner.rank);
              return (
                <TableRow key={winner.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge variant={rankDisplay.variant} className="font-bold">
                      {rankDisplay.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{winner.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {winner.employeeId || winner.customerId || '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {winner.mobileNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{getProgramName(winner.programId)}</p>
                      <p className="text-xs text-muted-foreground">{getEventName(winner.eventId)}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {winner.giftName ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="truncate max-w-[120px]">{winner.giftName}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No gift</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(winner.status)}>
                      {winner.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleLock(winner.id)}
                      className={cn(
                        winner.status === 'locked' && 'text-success'
                      )}
                    >
                      {winner.status === 'locked' ? (
                        <Lock className="h-4 w-4" />
                      ) : (
                        <Unlock className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredWinners.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  No winners found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
