import { Task, UserStats, PetState, Badge } from '../types';
import { INITIAL_BADGES } from '../data/mockData';

/**
 * Demo mode for pitch day.
 * - `?reset=1` (or 5 quick taps on the pet avatar / "Freak Out!" label) wipes every
 *   `freakout_*` key, seeds the hero-flow scenario and turns demo mode on.
 * - `?demo=0` turns demo mode off again (real-time timer, no Demo data badges).
 */

const DEMO_FLAG_KEY = 'freakout_demo_mode';

/** 1 focus minute = 3 seconds while demoing (5-minute task finishes in 15s). */
export const DEMO_SECONDS_PER_MINUTE = 3;

export function isDemoMode(): boolean {
  try {
    return localStorage.getItem(DEMO_FLAG_KEY) === '1';
  } catch {
    return false;
  }
}

/** Milliseconds per displayed timer second. Real: 1000ms. Demo: 50ms (60 ticks = 3s). */
export function focusTickMs(): number {
  return isDemoMode() ? (DEMO_SECONDS_PER_MINUTE * 1000) / 60 : 1000;
}

const daysAgoIso = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
const todayPlus = (days: number) => new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

/**
 * Seeded "overwhelmed student" scenario. Nothing is done yet today (hazy sky).
 * With energy "2. ล้า ๆ" + 25 minutes, Smart Pick lands on demo-email, which has
 * no micro-steps so the AI breakdown is the next on-stage beat.
 */
export function buildDemoTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'demo-email',
      title: 'ส่งอีเมลขอเลื่อนส่งรายงานกับอาจารย์',
      description: 'ร่างค้างไว้ 3 วันแล้ว กลัวใช้คำไม่สุภาพจนไม่กล้ากดส่ง',
      category: 'education',
      size: 'small',
      urgency: 'high',
      importance: 'high',
      flagged: true,
      tags: ['#urgent', '#อาจารย์'],
      deadline: todayPlus(0),
      time: '17:00',
      estimatedMinutes: 5,
      completed: false,
      createdAt: now,
      isOverthinkingProne: true,
      microSteps: [],
    },
    {
      id: 'demo-midterm',
      title: 'อ่านสรุปเตรียมสอบ Midterm สถิติ บทที่ 4-5',
      description: 'เนื้อหาเยอะมาก ไม่รู้จะเริ่มตรงไหน',
      category: 'education',
      size: 'large',
      urgency: 'high',
      importance: 'high',
      flagged: false,
      tags: ['#midterm', '#exam'],
      deadline: todayPlus(2),
      location: 'หอสมุดกลาง',
      estimatedMinutes: 60,
      completed: false,
      createdAt: now,
      isOverthinkingProne: true,
      microSteps: [
        { id: 'demo-midterm-1', title: 'เปิดสไลด์บทที่ 4 ดูหัวข้อใหญ่', completed: false, estimatedMinutes: 3 },
        { id: 'demo-midterm-2', title: 'ทำโจทย์ตัวอย่างข้อแรก', completed: false, estimatedMinutes: 10 },
      ],
    },
    {
      id: 'demo-slides',
      title: 'ทำสไลด์ Pitch งานกลุ่มวิชาผู้ประกอบการ',
      description: 'อยากให้ออกมาสวยจนยังไม่ได้เริ่มสักหน้า',
      category: 'project',
      size: 'large',
      urgency: 'medium',
      importance: 'high',
      flagged: false,
      tags: ['#group', '#canva'],
      deadline: todayPlus(5),
      estimatedMinutes: 45,
      completed: false,
      createdAt: now,
      isOverthinkingProne: true,
      microSteps: [],
    },
    {
      id: 'demo-homework',
      title: 'การบ้านแคลคูลัส แบบฝึกหัด 3.2',
      category: 'study',
      size: 'medium',
      urgency: 'medium',
      importance: 'medium',
      flagged: false,
      tags: ['#homework'],
      deadline: todayPlus(3),
      estimatedMinutes: 30,
      completed: false,
      createdAt: now,
      isOverthinkingProne: false,
      microSteps: [],
    },
    {
      id: 'demo-laundry',
      title: 'ซักผ้าและเก็บห้อง',
      category: 'life',
      size: 'small',
      urgency: 'low',
      importance: 'low',
      flagged: false,
      tags: ['#home'],
      estimatedMinutes: 20,
      completed: false,
      createdAt: now,
      isOverthinkingProne: false,
      microSteps: [],
    },
    {
      id: 'demo-club',
      title: 'ตอบแชทกลุ่มชมรมเรื่องนัดซ้อม',
      category: 'personal',
      size: 'small',
      urgency: 'low',
      importance: 'low',
      flagged: false,
      tags: ['#club'],
      estimatedMinutes: 10,
      completed: false,
      createdAt: now,
      isOverthinkingProne: false,
      microSteps: [],
    },
  ];
}

export const DEMO_STATS: UserStats = {
  xp: 320,
  level: 2,
  levelTitle: 'นักเริ่มงานมือโปร (Focus Starter)',
  streakDays: 3,
  lastActiveDate: daysAgoIso(1),
  tasksCompletedTotal: 9,
  minutesFocusedTotal: 140,
  overthinkingTasksSolved: 4,
};

export const DEMO_PET: PetState = {
  name: 'Cloudy',
  level: 2,
  affinity: 50,
  mood: 'zen',
  equippedAccessory: 'glasses',
  stardust: 240,
  streakFreezes: 1,
};

function demoBadges(): Badge[] {
  // Starter + first streak unlocked, the rest still to earn.
  return INITIAL_BADGES.map((b) => ({
    ...b,
    unlocked: ['badge-1', 'badge-3'].includes(b.id),
  }));
}

/** Wipe all app state and write the demo scenario. Does not reload. */
export function seedDemoState(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('freakout_')) keys.push(k);
  }
  keys.forEach((k) => localStorage.removeItem(k));

  localStorage.setItem(DEMO_FLAG_KEY, '1');
  localStorage.setItem('freakout_authenticated', 'true');
  localStorage.setItem('freakout_username', 'Jay');
  localStorage.setItem('freakout_is_pro', 'false');
  localStorage.setItem('freakout_tasks', JSON.stringify(buildDemoTasks()));
  localStorage.setItem('freakout_stats', JSON.stringify(DEMO_STATS));
  localStorage.setItem('freakout_pet', JSON.stringify(DEMO_PET));
  localStorage.setItem('freakout_badges', JSON.stringify(demoBadges()));
}

/** Seed and hard-reload into a clean app on the home tab. */
export function resetToDemo(): void {
  seedDemoState();
  window.location.replace(window.location.pathname);
}

/**
 * Run once before React mounts so state initialisers read the seeded values.
 * Handles `?reset=1` and `?demo=0`, then strips the query string.
 */
export function applyDemoUrlFlags(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    let touched = false;
    if (params.get('reset') === '1') {
      seedDemoState();
      touched = true;
    }
    if (params.get('demo') === '0') {
      localStorage.removeItem(DEMO_FLAG_KEY);
      touched = true;
    }
    if (touched) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  } catch {
    // Storage unavailable (private mode etc.): run without demo features.
  }
}
