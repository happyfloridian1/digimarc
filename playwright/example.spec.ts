import { test, expect } from "@playwright/test";

test("can add an item", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("What's up ? ...").fill("pickup dog");
  await page.getByPlaceholder("What's up ? ...").press("Enter");
  await expect(page.getByText("pickup dog")).toBeVisible();
});
// page
//  .locator("span")
// .filter({ hasText: /^pick up dog$/ })
//  .nth(2)
// ).toBeVisible();
