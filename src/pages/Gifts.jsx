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
import { mockGifts } from '@/data/mockData';
import { Plus, Search, Package, IndianRupee, Edit2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function Gifts() {
  const [gifts, setGifts] = useState(mockGifts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGift, setEditingGift] = useState(null);
  const [newGift, setNewGift] = useState({
    name: '',
    description: '',
    value: '',
    quantity: '',
  });

  const filteredGifts = gifts.filter(
    (gift) =>
      gift.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gift.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = gifts.reduce((acc, g) => acc + g.value * g.quantity, 0);
  const totalAssigned = gifts.reduce((acc, g) => acc + g.assignedCount, 0);
  const totalQuantity = gifts.reduce((acc, g) => acc + g.quantity, 0);

  const handleSaveGift = () => {
    if (!newGift.name || !newGift.value || !newGift.quantity) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (editingGift) {
      setGifts(
        gifts.map((g) =>
          g.id === editingGift.id
            ? {
                ...g,
                name: newGift.name,
                description: newGift.description,
                value: parseFloat(newGift.value),
                quantity: parseInt(newGift.quantity),
              }
            : g
        )
      );
      toast({
        title: 'Gift Updated',
        description: `"${newGift.name}" has been updated.`,
      });
    } else {
      const gift = {
        id: Date.now().toString(),
        name: newGift.name,
        description: newGift.description,
        value: parseFloat(newGift.value),
        quantity: parseInt(newGift.quantity),
        assignedCount: 0,
      };
      setGifts([gift, ...gifts]);
      toast({
        title: 'Gift Created',
        description: `"${gift.name}" has been added to the inventory.`,
      });
    }

    setNewGift({ name: '', description: '', value: '', quantity: '' });
    setEditingGift(null);
    setIsDialogOpen(false);
  };

  const handleEditGift = (gift) => {
    setEditingGift(gift);
    setNewGift({
      name: gift.name,
      description: gift.description,
      value: gift.value.toString(),
      quantity: gift.quantity.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setNewGift({ name: '', description: '', value: '', quantity: '' });
    setEditingGift(null);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gift Inventory</h1>
          <p className="text-muted-foreground">Manage prizes and track allocations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gold" onClick={() => setEditingGift(null)}>
              <Plus className="h-4 w-4" />
              Add Gift
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingGift ? 'Edit Gift' : 'Add New Gift'}</DialogTitle>
              <DialogDescription>
                {editingGift ? 'Update the gift details.' : 'Add a new prize to your gift inventory.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="giftName">Gift Name *</Label>
                <Input
                  id="giftName"
                  placeholder="e.g., iPhone 15 Pro"
                  value={newGift.name}
                  onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="giftDescription">Description</Label>
                <Textarea
                  id="giftDescription"
                  placeholder="Brief description of the gift..."
                  value={newGift.description}
                  onChange={(e) => setNewGift({ ...newGift, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="giftValue">Value (₹) *</Label>
                  <Input
                    id="giftValue"
                    type="number"
                    min="0"
                    placeholder="50000"
                    value={newGift.value}
                    onChange={(e) => setNewGift({ ...newGift, value: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="giftQuantity">Quantity *</Label>
                  <Input
                    id="giftQuantity"
                    type="number"
                    min="1"
                    placeholder="5"
                    value={newGift.quantity}
                    onChange={(e) => setNewGift({ ...newGift, quantity: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button onClick={handleSaveGift}>
                {editingGift ? 'Save Changes' : 'Add Gift'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-gold">
              <IndianRupee className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Inventory Value</p>
              <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{totalQuantity}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Allocation Progress</p>
              <p className="text-sm font-medium">{totalAssigned}/{totalQuantity}</p>
            </div>
            <Progress value={(totalAssigned / totalQuantity) * 100} className="h-2" />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search gifts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Gifts Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden animate-slide-up">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Gift</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Allocated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGifts.map((gift) => {
              const percentage = gift.quantity > 0 ? (gift.assignedCount / gift.quantity) * 100 : 0;
              const isFullyAllocated = gift.assignedCount >= gift.quantity;

              return (
                <TableRow key={gift.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium">{gift.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {gift.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                      {gift.value.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{gift.quantity}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 max-w-[100px]">
                        <Progress value={percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {gift.assignedCount}/{gift.quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isFullyAllocated ? 'success' : 'warning'}>
                      {isFullyAllocated ? 'Fully Allocated' : 'Available'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditGift(gift)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredGifts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  No gifts found. Add your first gift!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
