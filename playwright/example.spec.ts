import { test, expect } from '@playwright/test';

test('can add an item', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('What\'s up ?').fill('pickup dog');
  await page.getByPlaceholder('What\'s up ?').press('Enter');
  await expect(page.locator('div').filter({ hasText: /^pick up dog$/ }).nth(2)).toBeVisible()
});
