export interface LuckyDrawProgram {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  totalEvents: number;
  createdAt: string;
}

export interface LuckyDrawEvent {
  id: string;
  programId: string;
  name: string;
  date: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  totalWinners: number;
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  value: number;
  quantity: number;
  assignedCount: number;
  imageUrl?: string;
}

export interface Winner {
  id: string;
  programId: string;
  eventId: string;
  name: string;
  mobileNumber: string;
  employeeId?: string;
  customerId?: string;
  rank: number;
  giftId?: string;
  giftName?: string;
  status: 'pending' | 'assigned' | 'locked';
  createdAt: string;
}

export interface GiftAllocation {
  rank: number;
  giftId: string;
  giftName: string;
}

export type ProgramStatus = 'draft' | 'active' | 'completed';
export type EventStatus = 'draft' | 'active' | 'completed';
export type WinnerStatus = 'pending' | 'assigned' | 'locked';
