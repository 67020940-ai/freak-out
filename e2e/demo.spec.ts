import { test, expect } from '@playwright/test';

// สามารถปรับความเร็วดีเลย์ตรงนี้ได้ (มิลลิวินาที) เช่น 500ms, 800ms, 1200ms
// หรือส่งผ่าน env: DELAY=400 npx playwright test e2e/demo.spec.ts --headed
const STEP_DELAY = Number(process.env.DELAY) || 700;

test.describe('Freak Out! Automated Demo Walkthrough', () => {
  test('เล่นแอปตามขั้นตอนอัตโนมัติ สำหรับอัดหน้าจอ', async ({ page }) => {
    const delay = (ms = STEP_DELAY) => page.waitForTimeout(ms);

    // 1. เปิดหน้าแรก
    await page.goto('/');
    await delay(1000);

    // 2. ปรับระดับพลังงาน (โชว์การเปลี่ยนปุ่ม)
    await page.getByRole('button', { name: /4. พร้อมลุย/i }).click();
    await delay(600);
    await page.getByRole('button', { name: /1. หมดแรง/i }).click();
    await delay(600);
    await page.getByRole('button', { name: /3. พอไหว/i }).click();
    await delay(800);

    // 3. กดเปิดโหมด SOS
    const sosBtn = page.getByRole('button', { name: /SOS/i });
    if (await sosBtn.isVisible()) {
      await sosBtn.click();
      await delay(1200); // พักให้เห็นวงกลมหายใจ
      await page.getByRole('button', { name: /รู้สึกดีขึ้นแล้ว/i }).click();
      await delay(600);
    }

    // 4. สลับไปแท็บ Smart Pick
    const smartPickTab = page.getByTitle(/AI Smart Pick/i);
    await smartPickTab.click();
    await delay(1000);

    // 5. สลับไปแท็บ นูเบ้ (Cloud Pet)
    const petTab = page.getByRole('button', { name: 'นูเบ้', exact: true });
    await petTab.click();
    await delay(1000);

    // 6. สลับไปแท็บ รางวัล (Gamification)
    const rewardsTab = page.getByRole('button', { name: /รางวัล/i });
    await rewardsTab.click();
    await delay(1000);

    // 7. สลับกลับมาหน้า งานวันนี้
    const tasksTab = page.getByRole('button', { name: /งานวันนี้/i });
    await tasksTab.click();
    await delay(600);

    // 8. กดเปิด Focus Mode จากการ์ดงานแนะนำ
    const focusBtn = page.getByRole('button', { name: /เริ่มทำเลย \(Focus\)/i });
    if (await focusBtn.isVisible()) {
      await focusBtn.click();
      await delay(1500); // โชว์หน้านาฬิกา Focus Mode

      // ปิด Focus Mode
      const closeFocusBtn = page.locator('button:has(svg.lucide-x)').first();
      if (await closeFocusBtn.isVisible()) {
        await closeFocusBtn.click();
        await delay(500);
      }
    }

    await delay(500);
  });
});
