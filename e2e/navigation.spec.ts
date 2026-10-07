import { test, expect } from '@playwright/test';

test.describe('Freak Out! App Navigation & Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    // เข้าหน้าแอปพลิเคชัน
    await page.goto('/');
  });

  test('1. หน้าแรกแสดงผลองค์ประกอบหลักครบถ้วน', async ({ page }) => {
    // ตรวจสอบชื่อแท็บ Title
    await expect(page).toHaveTitle(/freak out/i);

    // ตรวจสอบคำทักทายประจำวัน
    await expect(page.getByText(/โฟกัสทีละอย่างนะ/i)).toBeVisible();

    // ตรวจสอบปุ่มเพิ่มงาน
    const addTaskBtn = page.getByRole('button', { name: /เพิ่มงาน/i });
    await expect(addTaskBtn).toBeVisible();

    // ตรวจสอบปุ่มฉุกเฉิน SOS
    const sosBtn = page.getByRole('button', { name: /SOS/i });
    await expect(sosBtn).toBeVisible();

    // ตรวจสอบปุ่มระดับพลังงาน (1-5)
    await expect(page.getByRole('button', { name: /1. หมดแรง/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /3. พอไหว/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /5. พลังเต็ม/i })).toBeVisible();
  });

  test('2. สลับแท็บเมนูด้านล่างได้ครบทุกหน้า (Bottom Navigation)', async ({ page }) => {
    // 2.1 สลับไปแท็บ 'ตารางเวลา'
    const calendarTab = page.getByRole('button', { name: /ตารางเวลา/i });
    await calendarTab.click();
    await expect(page.getByText(/ตารางเวลา/i).first()).toBeVisible();

    // 2.2 สลับไปแท็บ 'Smart Pick'
    const smartPickTab = page.getByTitle(/AI Smart Pick/i);
    await smartPickTab.click();
    await expect(page.getByText(/Smart Pick/i).first()).toBeVisible();

    // 2.3 สลับไปแท็บ 'นูเบ้' (Cloud Pet Tab - ใช้ exact: true เพื่อไม่ให้ชนกับปุ่มหัวเรื่องด้านบน)
    const petTab = page.getByRole('button', { name: 'นูเบ้', exact: true });
    await petTab.click();
    await expect(page.getByText(/นูเบ้/i).first()).toBeVisible();

    // 2.4 สลับไปแท็บ 'ตั้งค่า' (Settings Tab)
    const settingsTab = page.getByRole('button', { name: /ตั้งค่า/i });
    await settingsTab.click();
    await expect(page.getByText(/ตั้งค่าระบบ/i).first()).toBeVisible();

    // 2.5 สลับกลับมาแท็บ 'งานวันนี้' (Tasks)
    const tasksTab = page.getByRole('button', { name: /งานวันนี้/i });
    await tasksTab.click();
    await expect(page.getByText(/โฟกัสทีละอย่างนะ/i)).toBeVisible();
  });

  test('3. ทดสอบเปิดและปิด Modal เพิ่มงาน (+ เพิ่มงาน)', async ({ page }) => {
    // กดปุ่ม + เพิ่มงาน
    const addTaskBtn = page.getByRole('button', { name: /เพิ่มงาน/i });
    await addTaskBtn.click();

    // ตรวจสอบว่า Modal เพิ่มงานเปิดขึ้นมา
    const modalHeading = page.getByText(/เพิ่มงานใหม่/i).or(page.getByText(/สร้างงานใหม่/i)).or(page.getByPlaceholder(/อยากทำอะไรให้เสร็จ/i));
    await expect(modalHeading.first()).toBeVisible();

    // กดปุ่มปิด หรือ ยกเลิก
    const closeBtn = page.getByRole('button', { name: /ยกเลิก/i }).or(page.locator('button:has(svg.lucide-x)')).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('4. ทดสอบเปิดและปิด Modal ฉุกเฉิน SOS (Panic Calm)', async ({ page }) => {
    // กดปุ่ม SOS
    const sosBtn = page.getByRole('button', { name: /SOS/i });
    await sosBtn.click();

    // ตรวจสอบว่าหน้าจอสงบใจ/หายใจเข้าออกปรากฏ
    await expect(page.getByText(/ใจเย็น/i).or(page.getByText(/หายใจ/i)).or(page.getByText(/SOS/i)).first()).toBeVisible();

    // ปิดหน้าต่าง SOS
    const closeBtn = page.locator('button:has(svg.lucide-x)').or(page.getByRole('button', { name: /ปิด/i })).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  });

  test('5. ทดสอบการเปลี่ยนระดับพลังงาน (Energy Selector)', async ({ page }) => {
    // เลือกระดับพลังงาน "4. พร้อมลุย"
    const readyEnergyBtn = page.getByRole('button', { name: /4. พร้อมลุย/i });
    await readyEnergyBtn.click();

    // เลือกระดับพลังงาน "1. หมดแรง"
    const exhaustedEnergyBtn = page.getByRole('button', { name: /1. หมดแรง/i });
    await exhaustedEnergyBtn.click();
    await expect(exhaustedEnergyBtn).toBeVisible();
  });
});
