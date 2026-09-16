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

    // 1. Energy compatibility
    if (currentEnergy === 'low') {
      if (t.energy === 'low') {
        score += 50;
        reasons.push('เหมาะกับตอนพลังงานน้อย ทำง่าย ไม่เปลืองแรงสมอง');
      } else if (t.energy === 'medium') {
        score += 20;
      } else {
        score -= 30; // Avoid high energy tasks when exhausted
      }
    } else if (currentEnergy === 'medium') {
      if (t.energy === 'medium') {
        score += 40;
        reasons.push('ระดับพลังงานพอดีกับงานนี้');
      } else if (t.energy === 'low') {
        score += 35;
        reasons.push('เคลียร์ได้ไวเพื่อบูสต์โมเมนตัม');
      } else {
        score += 25;
      }
    } else {
      // High energy: tackle big high energy / important tasks!
      if (t.energy === 'high') {
        score += 50;
        reasons.push('คุณกำลังมีพลังเต็มเปี่ยม เหมาะกับการลุยงานสำคัญชิ้นใหญ่!');
      } else if (t.energy === 'medium') {
        score += 35;
      } else {
        score += 20;
      }
    }

    // 2. Time fit
    if (t.estimatedMinutes <= availableMinutes) {
      score += 40;
      reasons.push(`เวลา ${t.estimatedMinutes} นาที พอดีกับเวลาว่าง ${availableMinutes} นาที`);
    } else if (t.estimatedMinutes <= availableMinutes + 10) {
      score += 15;
    } else {
      score -= 25; // Exceeds available time too much
    }

    // 3. Urgency & Importance
    if (t.urgency === 'high') {
      score += 30;
      reasons.push('งานนี้มีความด่วนสูง ควรจัดการก่อน');
    }
    if (t.importance === 'high') {
      score += 25;
      reasons.push('เป็นงานสำคัญที่มีผลกระทบมาก');
    }

    // 4. Overthinking boost: if it's prone to overthinking, give extra push to start
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
 * Break down any task title/description into tiny 2-5 minute micro-steps
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
