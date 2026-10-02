export type EnergyLevel = 'low' | 'medium' | 'high';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type TaskCategory = 'study' | 'work' | 'personal' | 'project' | 'life';

export interface MicroStep {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  energy: EnergyLevel;
  urgency: UrgencyLevel;
  importance: UrgencyLevel;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  microSteps: MicroStep[];
  isOverthinkingProne?: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  lastActiveDate: string;
  tasksCompletedTotal: number;
  minutesFocusedTotal: number;
  overthinkingTasksSolved: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'starter' | 'streak' | 'focus' | 'anti-overthink' | 'master';
  xpReward: number;
}

export interface PetState {
  name: string;
  level: number;
  affinity: number; // 0 - 100
  mood: 'happy' | 'focus' | 'zen' | 'working' | 'celebrate';
  equippedAccessory?: string;
  stardust: number;
  streakFreezes: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:30"
  category: 'class' | 'meeting' | 'break' | 'focus';
  source: 'google' | 'apple' | 'outlook' | 'freakout';
  isFocusShield?: boolean;
}

