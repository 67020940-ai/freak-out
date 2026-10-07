import { test, expect } from '@playwright/test';

const STEP_DELAY = Number(process.env.DELAY) || 500;

test.describe('Freak Out! Pitch Hero Flow Walkthrough', () => {
  test('Hero Flow: Overwhelmed -> Energy 2 -> Smart Pick -> AI Micro-Steps -> Focus -> Atmospheric Mirror Payoff', async ({ page }) => {
    const delay = (ms = STEP_DELAY) => page.waitForTimeout(ms);

    // 1. เข้าแอปพร้อม Seed ข้อมูลเดโมสดใหม่ (?reset=1)
    await page.goto('/?reset=1');
    await delay(800);

    // ตรวจสอบว่าแอปเปิดขึ้นมาและแสดงหมอกจางๆ
    await expect(page.getByText(/หมอกจางๆ/i).first()).toBeVisible();
    await expect(page.getByText(/โฟกัสทีละอย่างนะ/i)).toBeVisible();

    // 2. เลือกระดับพลังงาน "2. ล้า ๆ" (Overwhelmed & Tired)
    const energyTiredBtn = page.getByRole('button', { name: /2. ล้า ๆ/i });
    await expect(energyTiredBtn).toBeVisible();
    await energyTiredBtn.click();
    await delay(600);

    // 3. กดแท็บ Smart Pick เพื่อให้ระบบช่วยตัดทางเลือกเหลือ 1 งาน
    const smartPickTab = page.getByTitle(/AI Smart Pick/i);
    await smartPickTab.click();
    await delay(700);

    // ยืนยันว่าหน้า Smart Pick แนะนำงานอีเมล (demo-email)
    await expect(page.getByText(/ส่งอีเมลขอเลื่อนส่งรายงานกับอาจารย์/i).first()).toBeVisible();

    // 4. กดปุ่มให้ AI ช่วยย่อยก้าวแรก 2 นาที (AI Decompose)
    const aiDecomposeBtn = page.getByRole('button', { name: /ให้ AI ช่วยย่อยก้าวแรก/i });
    if (await aiDecomposeBtn.isVisible()) {
      await aiDecomposeBtn.click();
      await delay(800);
    }

    // 5. กดเริ่มโฟกัสทันที (เปิด Focus Mode)
    const startFocusBtn = page.getByRole('button', { name: /เริ่มทำทันที \(เปิดโหมดโฟกัส\)/i });
    await expect(startFocusBtn).toBeVisible();
    await startFocusBtn.click();
    await delay(1000);

    // ยืนยันว่าหน้า Focus Mode เปิดขึ้นมา
    await expect(page.getByText(/Focus Mode/i).first()).toBeVisible();

    // 6. กดเริ่มจับเวลา ⏱️ (ระบบเร่งเวลาในโหมดเดโม)
    const timerToggleBtn = page.getByRole('button', { name: /เริ่มจับเวลา/i });
    if (await timerToggleBtn.isVisible()) {
      await timerToggleBtn.click();
      await delay(1200);
    }

    // 7. ติ๊กก้าวย่อย (Micro-steps) แสดงการปลดปล่อยความคิด
    const stepCheckbox = page.locator('.lucide-circle').first();
    if (await stepCheckbox.isVisible()) {
      await stepCheckbox.click();
      await delay(500);
    }

    // 8. กดปุ่มทำงานนี้เสร็จสมบูรณ์แล้ว! (+50 XP) เพื่อรับรางวัลและกลับหน้าหลัก
    const completeTaskBtn = page.getByRole('button', { name: /ทำงานนี้เสร็จสมบูรณ์แล้ว/i });
    await expect(completeTaskBtn).toBeVisible();
    await completeTaskBtn.click();
    await delay(1200);

    // 9. ยืนยันผลลัพธ์ Payoff: ท้องฟ้าเปิด (Atmospheric Mirror)
    await expect(page.getByText(/ท้องฟ้าเริ่มเปิด/i).first()).toBeVisible();
  });
});
