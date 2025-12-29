import { StatCard } from '@/components/dashboard/StatCard';
import { RecentWinners } from '@/components/dashboard/RecentWinners';
import { ProgramOverview } from '@/components/dashboard/ProgramOverview';
import { GiftAllocationChart } from '@/components/dashboard/GiftAllocationChart';
import { mockPrograms, mockWinners, mockGifts } from '@/data/mockData';
import { Trophy, Gift, Users, Calendar } from 'lucide-react';

export default function Dashboard() {
  const totalPrograms = mockPrograms.length;
  const activePrograms = mockPrograms.filter(p => p.status === 'active').length;
  const totalWinners = mockWinners.length;
  const assignedGifts = mockGifts.reduce((acc, g) => acc + g.assignedCount, 0);
  const totalGifts = mockGifts.reduce((acc, g) => acc + g.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your lucky draw programs and winners</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Programs"
          value={totalPrograms}
          subtitle={`${activePrograms} active`}
          icon={Calendar}
          variant="default"
        />
        <StatCard
          title="Total Winners"
          value={totalWinners}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Gifts Allocated"
          value={`${assignedGifts}/${totalGifts}`}
          subtitle={`${Math.round((assignedGifts / totalGifts) * 100)}% distributed`}
          icon={Gift}
          variant="gold"
        />
        <StatCard
          title="Top Prize"
          value="₹1.2L"
          subtitle="iPhone 15 Pro"
          icon={Trophy}
          variant="gold"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProgramOverview programs={mockPrograms} />
        <RecentWinners winners={mockWinners} />
      </div>

      {/* Gift Allocation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GiftAllocationChart gifts={mockGifts} />
      </div>
    </div>
  );
}
