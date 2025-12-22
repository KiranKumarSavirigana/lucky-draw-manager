import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockEvents, mockPrograms } from '@/data/mockData';
import { LuckyDrawEvent } from '@/types/luckyDraw';
import { Plus, Search, Calendar, Users, ArrowLeft, MoreHorizontal, Copy, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

export default function Events() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const program = mockPrograms.find((p) => p.id === programId);

  const [events, setEvents] = useState<LuckyDrawEvent[]>(
    mockEvents.filter((e) => e.programId === programId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    date: '',
    description: '',
  });

  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeVariant = (status: LuckyDrawEvent['status']) => {
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

  const handleCreateEvent = () => {
    if (!newEvent.name || !newEvent.date) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const event: LuckyDrawEvent = {
      id: Date.now().toString(),
      programId: programId!,
      name: newEvent.name,
      date: newEvent.date,
      description: newEvent.description,
      status: 'draft',
      totalWinners: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setEvents([event, ...events]);
    setNewEvent({ name: '', date: '', description: '' });
    setIsDialogOpen(false);
    toast({
      title: 'Event Created',
      description: `"${event.name}" has been created successfully.`,
    });
  };

  const handleCloneEvent = (event: LuckyDrawEvent) => {
    const clonedEvent: LuckyDrawEvent = {
      ...event,
      id: Date.now().toString(),
      name: `${event.name} (Copy)`,
      status: 'draft',
      totalWinners: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setEvents([clonedEvent, ...events]);
    toast({
      title: 'Event Cloned',
      description: `"${clonedEvent.name}" has been created.`,
    });
  };

  const handleManageWinners = (eventId: string) => {
    navigate(`/programs/${programId}/events/${eventId}/winners`);
  };

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Program not found</p>
        <Button variant="outline" onClick={() => navigate('/programs')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit"
          onClick={() => navigate('/programs')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{program.name}</h1>
            <p className="text-muted-foreground">Manage events for this program</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold">
                <Plus className="h-4 w-4" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Set up a new event for this lucky draw program.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Event Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Week 1 Draw"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Event Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the event..."
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent}>Create Event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Event Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Winners</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id} className="hover:bg-muted/30">
                <TableCell>
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                      {event.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(event.status)}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {event.totalWinners}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(event.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => handleManageWinners(event.id)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Manage Winners
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCloneEvent(event)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone Event
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No events found. Create your first event for this program!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
