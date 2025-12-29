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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { mockWinners, mockPrograms, mockEvents, mockGifts } from '@/data/mockData';
import { Plus, Search, Lock, Unlock, Download, Phone, Gift, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function EventWinners() {
  const { programId, eventId } = useParams();
  const navigate = useNavigate();

  const program = mockPrograms.find((p) => p.id === programId);
  const event = mockEvents.find((e) => e.id === eventId);

  const [winners, setWinners] = useState(
    mockWinners.filter((w) => w.eventId === eventId)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWinner, setNewWinner] = useState({
    name: '',
    mobileNumber: '',
    employeeId: '',
    customerId: '',
    rank: '',
    giftId: '',
  });

  const filteredWinners = winners.filter((winner) => {
    const matchesSearch =
      winner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      winner.mobileNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || winner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const getRankDisplay = (rank) => {
    if (rank === 1) return { label: '1st', variant: 'gold' };
    if (rank === 2) return { label: '2nd', variant: 'secondary' };
    if (rank === 3) return { label: '3rd', variant: 'warning' };
    return { label: `${rank}th`, variant: 'muted' };
  };

  const handleAddWinner = () => {
    if (!newWinner.name || !newWinner.mobileNumber || !newWinner.rank) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    const isDuplicate = winners.some(
      (w) => w.mobileNumber === newWinner.mobileNumber
    );

    if (isDuplicate) {
      toast({
        title: 'Duplicate Entry',
        description: 'This participant already exists in this event.',
        variant: 'destructive',
      });
      return;
    }

    const gift = mockGifts.find((g) => g.id === newWinner.giftId);
    const winner = {
      id: Date.now().toString(),
      programId: programId,
      eventId: eventId,
      name: newWinner.name,
      mobileNumber: newWinner.mobileNumber,
      employeeId: newWinner.employeeId || undefined,
      customerId: newWinner.customerId || undefined,
      rank: parseInt(newWinner.rank),
      giftId: newWinner.giftId || undefined,
      giftName: gift?.name,
      status: newWinner.giftId ? 'assigned' : 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setWinners([...winners, winner].sort((a, b) => a.rank - b.rank));
    setNewWinner({
      name: '',
      mobileNumber: '',
      employeeId: '',
      customerId: '',
      rank: '',
      giftId: '',
    });
    setIsDialogOpen(false);
    toast({
      title: 'Winner Added',
      description: `${winner.name} has been added as #${winner.rank} winner.`,
    });
  };

  const handleToggleLock = (winnerId) => {
    setWinners(
      winners.map((w) => {
        if (w.id === winnerId) {
          const newStatus = w.status === 'locked' ? 'assigned' : 'locked';
          toast({
            title: newStatus === 'locked' ? 'Winner Locked' : 'Winner Unlocked',
            description: `${w.name}'s record has been ${newStatus}.`,
          });
          return { ...w, status: newStatus };
        }
        return w;
      })
    );
  };

  const handleExport = () => {
    const csv = [
      ['Rank', 'Name', 'Mobile', 'Employee ID', 'Customer ID', 'Gift', 'Status'].join(','),
      ...filteredWinners.map((w) =>
        [w.rank, w.name, w.mobileNumber, w.employeeId || '', w.customerId || '', w.giftName || '', w.status].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'winners'}-list.csv`;
    a.click();
    toast({
      title: 'Export Complete',
      description: 'Winners list has been downloaded.',
    });
  };

  if (!program || !event) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Event not found</p>
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
          onClick={() => navigate(`/programs/${programId}/events`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{program.name}</p>
            <h1 className="text-2xl font-bold tracking-tight">{event.name}</h1>
            <p className="text-muted-foreground">Manage winners for this event</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="gold">
                  <Plus className="h-4 w-4" />
                  Add Winner
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add New Winner</DialogTitle>
                  <DialogDescription>
                    Enter the winner's details and assign their prize.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="winnerName">Name *</Label>
                      <Input
                        id="winnerName"
                        placeholder="Full name"
                        value={newWinner.name}
                        onChange={(e) => setNewWinner({ ...newWinner, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number *</Label>
                      <Input
                        id="mobile"
                        placeholder="+91 98765 43210"
                        value={newWinner.mobileNumber}
                        onChange={(e) => setNewWinner({ ...newWinner, mobileNumber: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee ID</Label>
                      <Input
                        id="employeeId"
                        placeholder="EMP001"
                        value={newWinner.employeeId}
                        onChange={(e) => setNewWinner({ ...newWinner, employeeId: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerId">Customer ID</Label>
                      <Input
                        id="customerId"
                        placeholder="CUST001"
                        value={newWinner.customerId}
                        onChange={(e) => setNewWinner({ ...newWinner, customerId: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rank">Winning Rank *</Label>
                      <Input
                        id="rank"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={newWinner.rank}
                        onChange={(e) => setNewWinner({ ...newWinner, rank: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Assign Gift</Label>
                      <Select
                        value={newWinner.giftId}
                        onValueChange={(value) => setNewWinner({ ...newWinner, giftId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gift" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          {mockGifts.map((gift) => (
                            <SelectItem key={gift.id} value={gift.id}>
                              {gift.name} (₹{gift.value.toLocaleString()})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddWinner}>Add Winner</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
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
              <TableHead>ID</TableHead>
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
                    <p className="font-medium">{winner.name}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      {winner.mobileNumber}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {winner.employeeId || winner.customerId || '-'}
                  </TableCell>
                  <TableCell>
                    {winner.giftName ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Gift className="h-4 w-4 text-primary" />
                        <span className="truncate max-w-[150px]">{winner.giftName}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">No gift assigned</span>
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
                  No winners found. Add your first winner for this event!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
