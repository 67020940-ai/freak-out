import { test, expect } from '@playwright/test';

test('has title and renders home page', async ({ page }) => {
  await page.goto('/');

  // Expect title to contain 'freak out'
  await expect(page).toHaveTitle(/freak out/i);
});
