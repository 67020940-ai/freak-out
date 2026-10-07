import { Task, EnergyLevel, MicroStep } from '../types';

/**
 * Intelligent recommendation algorithm to pick the single best task
 * to beat analysis paralysis & overthinking based on current energy and time available.
 */
export function recommendBestTask(
  tasks: Task[],
  currentEnergy: EnergyLevel,
  availableMinutes: number
): { task: Task; reasonTh: string } | null {
  const pendingTasks = tasks.filter((t) => !t.completed);
  if (pendingTasks.length === 0) return null;

  // Score each task
  const scored = pendingTasks.map((t) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Energy & Size compatibility (5-level scale matching user mood)
    if (currentEnergy === 'depleted' || currentEnergy === 'low') {
      if (t.size === 'small' || t.estimatedMinutes <= 15 || t.energy === 'low') {
        score += 50;
        reasons.push('เหมาะกับตอนหมดแรง ทำง่าย ใช้เวลาน้อย ไม่เปลืองแรงสมอง');
      } else if (t.size === 'medium' || t.energy === 'medium') {
        score += 15;
      } else {
        score -= 35; // Avoid big draining tasks when depleted
      }
    } else if (currentEnergy === 'tired') {
      if (t.size === 'small' || t.estimatedMinutes <= 15) {
        score += 45;
        reasons.push('งานเบาๆ ช่วยให้ค่อยเป็นค่อยไป ไม่กดดัน');
      } else if (t.size === 'medium') {
        score += 30;
      } else {
        score -= 20;
      }
    } else if (currentEnergy === 'okay' || currentEnergy === 'medium') {
      if (t.size === 'medium' || t.energy === 'medium') {
        score += 45;
        reasons.push('ระดับพลังงานพอดีคำ เหมาะกับการเคลียร์งานนี้');
      } else if (t.size === 'small' || t.energy === 'low') {
        score += 35;
        reasons.push('เคลียร์ได้ไวเพื่อสะสมกำลังใจ');
      } else {
        score += 25;
      }
    } else if (currentEnergy === 'ready') {
      if (t.size === 'large' || t.flagged || t.size === 'medium') {
        score += 45;
        reasons.push('สมองแล่น โฟกัสพร้อมลุยงานสำคัญชิ้นนี้ได้เต็มที่');
      } else {
        score += 30;
      }
    } else {
      // 'full' or 'high': Tackle big high-impact tasks!
      if (t.size === 'large' || t.energy === 'high') {
        score += 55;
        reasons.push('คุณกำลังมีพลังเต็มเปี่ยม เหมาะกับการลุยงานสำคัญชิ้นใหญ่ที่สุด!');
      } else if (t.flagged) {
        score += 45;
        reasons.push('พลังเต็มร้อย ลุยงานปักธงให้เสร็จสวยๆ');
      } else {
        score += 25;
      }
    }

    // 2. Flagged bonus
    if (t.flagged) {
      score += 30;
      reasons.push('งานนี้ปักธง 🚩 สำคัญเป็นพิเศษ');
    }

    // 3. Time fit
    if (t.estimatedMinutes <= availableMinutes) {
      score += 40;
      reasons.push(`เวลา ~${t.estimatedMinutes} นาที พอดีกับเวลาว่าง ${availableMinutes} นาที`);
    } else if (t.estimatedMinutes <= availableMinutes + 10) {
      score += 15;
    } else {
      score -= 25; // Exceeds available time too much
    }

    // 4. Urgency & Importance
    if (t.urgency === 'high') {
      score += 30;
      reasons.push('งานนี้มีความด่วนสูง ควรจัดการก่อน');
    }
    if (t.importance === 'high') {
      score += 20;
      reasons.push('เป็นงานสำคัญที่มีผลกระทบมาก');
    }

    // 5. Overthinking boost: if it's prone to overthinking, give extra push to start
    if (t.isOverthinkingProne) {
      score += 15;
      reasons.push('งานนี้อาจทำให้คุณคิดวน แค่เริ่มก้าวแรกจะโล่งขึ้นทันที!');
    }

    return {
      task: t,
      score,
      reason: reasons.slice(0, 2).join(' • ') || 'เป็นงานที่คุ้มค่าที่สุดในการเริ่มตอนนี้',
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return {
    task: scored[0].task,
    reasonTh: scored[0].reason,
  };
}

/**
 * Break down any task title/description into tiny 2-5 minute micro-steps (offline template fallback).
 */
export function generateMicroSteps(taskTitle: string, category: string): MicroStep[] {
  const t = taskTitle.toLowerCase();

  // Smart template generation based on keywords
  if (t.includes('อ่าน') || t.includes('สอบ') || t.includes('study') || t.includes('การบ้าน') || category === 'study') {
    return [
      { id: `step-${Date.now()}-1`, title: 'เปิดหนังสือ/ชีทหน้าที่ต้องอ่าน วางไว้ตรงหน้า', completed: false, estimatedMinutes: 2 },
      { id: `step-${Date.now()}-2`, title: 'กวาดสายตาดูหัวข้อใหญ่ & รูปภาพ 1 รอบ', completed: false, estimatedMinutes: 3 },
      { id: `step-${Date.now()}-3`, title: 'อ่านและไฮไลท์ 3 พารากราฟแรก', completed: false, estimatedMinutes: 7 },
      { id: `step-${Date.now()}-4`, title: 'จดสรุป 3 บรรทัดด้วยภาษาตัวเอง', completed: false, estimatedMinutes: 5 },
    ];
  }

  if (t.includes('เมล') || t.includes('email') || t.includes('ส่งงาน') || t.includes('ติดต่อ')) {
    return [
      { id: `step-${Date.now()}-1`, title: 'เปิดหน้าต่างร่างอีเมล/แชท ใส่ชื่อผู้รับ', completed: false, estimatedMinutes: 2 },
      { id: `step-${Date.now()}-2`, title: 'พิมพ์ประเด็นหลัก 2-3 บรรทัดสั้นๆ', completed: false, estimatedMinutes: 4 },
      { id: `step-${Date.now()}-3`, title: 'แนบไฟล์ (ถ้ามี) ตรวจทานคำสุภาพ', completed: false, estimatedMinutes: 3 },
      { id: `step-${Date.now()}-4`, title: 'กดส่งทันที ห้ามคิดวนเกิน 30 วินาที!', completed: false, estimatedMinutes: 1 },
    ];
  }

  if (t.includes('สไลด์') || t.includes('present') || t.includes('นำเสนอ') || t.includes('canva') || t.includes('รายงาน')) {
    return [
      { id: `step-${Date.now()}-1`, title: 'เปิดไฟล์เปล่า ตั้งชื่อไฟล์ และสร้าง 4 หน้าว่าง', completed: false, estimatedMinutes: 2 },
      { id: `step-${Date.now()}-2`, title: 'เขียนโครง 3 ส่วน: ปัญหา, วิธีแก้, บทสรุป', completed: false, estimatedMinutes: 8 },
      { id: `step-${Date.now()}-3`, title: 'ใส่ข้อมูลหน้าแรกให้เสร็จ ไม่ต้องเน้นสวย', completed: false, estimatedMinutes: 10 },
    ];
  }

  if (t.includes('จัด') || t.includes('เก็บ') || t.includes('ทำความสะอาด') || category === 'life') {
    return [
      { id: `step-${Date.now()}-1`, title: 'ทิ้งขยะและแก้วน้ำที่หมดแล้ว', completed: false, estimatedMinutes: 2 },
      { id: `step-${Date.now()}-2`, title: 'จัดของ 1 มุมให้เข้าที่', completed: false, estimatedMinutes: 3 },
      { id: `step-${Date.now()}-3`, title: 'เช็ดพื้นผิวให้สะอาดสะอ้าน', completed: false, estimatedMinutes: 3 },
    ];
  }

  // Default universal anti-overthinking micro-steps
  return [
    { id: `step-${Date.now()}-1`, title: 'เตรียมอุปกรณ์ / เปิดโปรแกรมที่จำเป็น', completed: false, estimatedMinutes: 2 },
    { id: `step-${Date.now()}-2`, title: 'ลงมือทำชิ้นส่วนที่ง่ายที่สุดก่อน 5 นาที', completed: false, estimatedMinutes: 5 },
    { id: `step-${Date.now()}-3`, title: 'ทำส่วนต่อไปแบบไม่ต้องกังวลความสมบูรณ์แบบ', completed: false, estimatedMinutes: 10 },
    { id: `step-${Date.now()}-4`, title: 'ตรวจเช็คความเรียบร้อยรอบสุดท้าย', completed: false, estimatedMinutes: 3 },
  ];
}

/**
 * Call Gemini 2.5 Flash via /api/decompose to generate tailor-made micro-steps.
 * If venue Wi-Fi is down, API key is missing, or network fails, gracefully
 * fall back to generateMicroSteps() so the app never blocks or errors out.
 */
export async function decomposeTaskWithAI(
  taskTitle: string,
  category: string
): Promise<{ steps: MicroStep[]; source: 'gemini' | 'offline-template' }> {
  try {
    const res = await fetch('/api/decompose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskTitle, category }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.steps) && data.steps.length > 0) {
        const steps: MicroStep[] = data.steps.map((s: any, idx: number) => ({
          id: `step-ai-${Date.now()}-${idx}`,
          title: String(s.title || `ขั้นตอนที่ ${idx + 1}`),
          completed: false,
          estimatedMinutes: Number(s.estimatedMinutes) || 3,
        }));
        return { steps, source: 'gemini' };
      }
    }
  } catch {
    // Network failed or offline: silently fall back
  }

  return { steps: generateMicroSteps(taskTitle, category), source: 'offline-template' };
}

export interface CognitiveAnalysisResult {
  stressLevel: 'ต่ำ' | 'ปานกลาง' | 'สูง';
  readinessScore: number;
  advice: string;
  cognitiveBandwidth: string;
}

export async function analyzeReadinessWithAI(
  energy: string,
  taskCount: number,
  overthinkCount: number,
  completedToday: number
): Promise<CognitiveAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-readiness', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ energy, taskCount, overthinkCount, completedToday }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        stressLevel: data.stressLevel || 'ปานกลาง',
        readinessScore: Number(data.readinessScore) || 75,
        advice: data.advice || 'ค่อยๆ ก้าวทีละ 1 งานเล็กๆ สมองจะเริ่มโล่งขึ้นเอง',
        cognitiveBandwidth: data.cognitiveBandwidth || 'พร้อมรับงาน 60%',
      };
    }
  } catch {
    // Offline fallback
  }

  return {
    stressLevel: overthinkCount > 2 ? 'สูง' : taskCount > 4 ? 'ปานกลาง' : 'ต่ำ',
    readinessScore: energy === 'depleted' ? 30 : energy === 'tired' ? 50 : 80,
    advice: 'เลือกงานที่ใช้เวลา 5-10 นาทีทำก่อน เพื่อสร้างชัยชนะแรกของวัน',
    cognitiveBandwidth: 'พร้อมระดับปกติ',
  };
}
