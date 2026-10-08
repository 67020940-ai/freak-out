import { Task, Badge, UserStats } from '../types';

export const INITIAL_STATS: UserStats = {
  xp: 0,
  level: 1,
  levelTitle: 'ผู้เริ่มต้น (Beginner)',
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  tasksCompletedTotal: 0,
  minutesFocusedTotal: 0,
  overthinkingTasksSolved: 0,
};

// No mock tasks - completely clean and starts from zero
export const INITIAL_TASKS: Task[] = [];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'ก้าวแรกชนะทุกสิ่ง',
    description: 'ทำงานชิ้นแรกสำเร็จด้วยการแบ่งย่อยเป็น Micro-step',
    icon: '🌱',
    unlocked: false,
    category: 'starter',
    xpReward: 50,
  },
  {
    id: 'badge-2',
    title: 'ปราบ Overthinking',
    description: 'ใช้ปุ่มช่วยเลือกงานและทำจนเสร็จโดยไม่ลังเล',
    icon: '🧠',
    unlocked: false,
    category: 'anti-overthink',
    xpReward: 100,
  },
  {
    id: 'badge-3',
    title: 'Streak ไฟลุก 3 วัน',
    description: 'เข้าใช้งานและทำงานต่อเนื่อง 3 วันติด',
    icon: '🔥',
    unlocked: false,
    category: 'streak',
    xpReward: 150,
  },
  {
    id: 'badge-4',
    title: 'Focus Master 25 Min',
    description: 'จดจ่อในโหมด Focus จนจบรอบ Pomodoro',
    icon: '⏱️',
    unlocked: false,
    category: 'focus',
    xpReward: 120,
  },
  {
    id: 'badge-5',
    title: 'พลังงานต่ำก็ลุยได้',
    description: 'ทำงานสำเร็จแม้ในวันที่พลังงาน Low Energy',
    icon: '🪫',
    unlocked: false,
    category: 'anti-overthink',
    xpReward: 100,
  },
  {
    id: 'badge-6',
    title: 'เทพแห่งการเคลียร์สมอง',
    description: 'ทำเควสต์สมองโล่งสำเร็จครบ 10 ชิ้นในสัปดาห์',
    icon: '👑',
    unlocked: false,
    category: 'master',
    xpReward: 300,
  },
  {
    id: 'badge-7',
    title: 'Zen Master (SOS Calm)',
    description: 'ใช้แบบฝึกหัดฝึกหายใจคลายเครียดในโหมดฉุกเฉิน',
    icon: '🧘',
    unlocked: false,
    category: 'anti-overthink',
    xpReward: 80,
  },
  {
    id: 'badge-8',
    title: 'Streak แชมป์เปี้ยน 7 วัน',
    description: 'รักษาวินัยความต่อเนื่องครบ 7 วันเต็ม',
    icon: '⚡',
    unlocked: false,
    category: 'streak',
    xpReward: 250,
  },
];

export const MASCOT_QUOTES = [
  'ไม่ต้องสมบูรณ์แบบ แค่เริ่มทำ 2 นาทีแรกก็เก่งมากๆ แล้วนะ',
  'ถ้าคิดเยอะจนปวดหัว ลองกดปุ่ม "ช่วยเลือกงาน" ให้เค้าเลือกให้สิ',
  'เหนื่อยก็ทำแบบ Low Energy ได้นะ ทีละนิดก็ถึงเส้นชัยเหมือนกัน',
  'You got this! วันนี้เราจะสู้ไปด้วยกัน ไม่ทิ้งกันแน่นอน',
  'สูดหายใจลึกๆ 4 วิ... ผ่อนออกช้าๆ 8 วิ สมองโล่งแล้วลุยต่อ',
  'แบ่งงานใหญ่ให้เป็นก้อนจิ๋วๆ เหมือนกินขนมทีละคำนะ',
];
