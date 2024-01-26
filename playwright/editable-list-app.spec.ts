import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todoist.devgossips.vercel.app/");
});

const TODO_ITEMS = ["Purchase a cake", "Purchase milk", "Go to Library"];

test("should allow me to add items", async ({ page }) => {
  // create a new todo locator
  const newTodoInput = page.getByPlaceholder("What's up ? ...");

  // Create 1st todo.
  await newTodoInput.fill(TODO_ITEMS[0]);
  await newTodoInput.press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.getByText(TODO_ITEMS[0])).toBeVisible();

  // Create 2nd todo.
  await newTodoInput.fill(TODO_ITEMS[1]);
  await newTodoInput.press("Enter");

  // Make sure the list now has two todo items.
  await expect(page.getByText(TODO_ITEMS[0])).toBeVisible();
  await expect(page.getByText(TODO_ITEMS[1])).toBeVisible();

  // Create 3rd todo.
  await newTodoInput.fill(TODO_ITEMS[2]);
  await newTodoInput.press("Enter");

  // Make sure the list now has two todo items.
  await expect(page.getByText(TODO_ITEMS[0])).toBeVisible();
  await expect(page.getByText(TODO_ITEMS[1])).toBeVisible();
  await expect(page.getByText(TODO_ITEMS[2])).toBeVisible();
});

test("should allow me to mark items as done", async ({ page }) => {
  //create a to do item
  const newTodoInput = page.getByPlaceholder("What's up ? ...");
  await newTodoInput.fill(TODO_ITEMS[2]);
  await newTodoInput.press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.getByText(TODO_ITEMS[2])).toBeVisible();

  //create locator for the item to be marked as done and the checklist buttom
  const checklistButton = page.locator("(//button[@aria-label='done'])[2]");

  await checklistButton.click();

  //check to see if @class == chakra-editable__preview css-xx5ldn
  const markedItem = await page
    .locator("span.chakra-editable__preview.css-xx5ldn")
    .getByText(TODO_ITEMS[2]);

  //check to see if this is visible
  await expect(markedItem).toBeVisible();
});

test("should allow me to change the theme", async ({ page }) => {
  // create locators for the dark & light theme buttons
  const darkModeButton = page.locator(
    "//button[@aria-label='Switch to dark mode']"
  );
  const lightModeButton = page.locator(
    "//button[@aria-label='Switch to light mode']"
  );

  if (await darkModeButton.isVisible()) {
    await darkModeButton.click();
    await expect(darkModeButton).toBeHidden();
    await expect(lightModeButton).toBeVisible();

    await lightModeButton.click();
    await expect(lightModeButton).toBeHidden();
    await expect(darkModeButton).toBeVisible();
  } else {
    await lightModeButton.click();
    await expect(lightModeButton).toBeHidden();
    await expect(darkModeButton).toBeVisible();

    await darkModeButton.click();
    await expect(darkModeButton).toBeHidden();
    await expect(lightModeButton).toBeVisible();
  }
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
