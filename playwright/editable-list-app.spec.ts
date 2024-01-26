import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://todoist.devgossips.vercel.app/");
});

test.afterEach(async ({ page }) => {
  await page.close();
});

const TODO_ITEMS = ["Purchase a cake", "Purchase milk", "Go to Library"];

test.only("should allow me to add items", async ({ page }) => {
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
  await expect(
    page.getByText(TODO_ITEMS[0]) && page.getByText(TODO_ITEMS[1])
  ).toBeVisible();

  // Create 3rd todo.
  await newTodoInput.fill(TODO_ITEMS[2]);
  await newTodoInput.press("Enter");

  // Make sure the list now has two todo items.
  await expect(
    page.getByText(TODO_ITEMS[0]) &&
      page.getByText(TODO_ITEMS[1]) &&
      page.getByText(TODO_ITEMS[2])
  ).toBeVisible();
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

test("should allow me to edit an item", async ({ page }) => {
  //create a to do item
  const newTodoInput = page.getByPlaceholder("What's up ? ...");
  await newTodoInput.fill(TODO_ITEMS[1]);
  await newTodoInput.press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.getByText(TODO_ITEMS[1])).toBeVisible();

  //edit the item
  const itemToEdit = page.getByText(TODO_ITEMS[1]);

  await itemToEdit.click();
  await page.getByRole("textbox").nth(1).fill("");
  await page.getByRole("textbox").nth(1).fill("Buy plant-based milk");
  await page.getByRole("textbox").nth(1).press("Enter");

  await expect(page.getByText("Buy plant-based milk")).toBeVisible();
});

test("should allow me to delete an item", async ({ page }) => {
  //create a to do item
  const newTodoInput = page.getByPlaceholder("What's up ? ...");
  await newTodoInput.fill(TODO_ITEMS[0]);
  await newTodoInput.press("Enter");

  // Make sure the list only has one todo item.
  await expect(page.getByText(TODO_ITEMS[0])).toBeVisible();

  //edit the item
  const deleteButton = page.locator("//button[@aria-label='close']");

  await deleteButton.click();

  await expect(page.getByText(TODO_ITEMS[0])).not.toBeVisible();
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

test("should track the session stats", async ({ page }) => {
  // create a new todo locator
  const newTodoInput = page.getByPlaceholder("What's up ? ...");

  // Create todo items.
  await newTodoInput.fill(TODO_ITEMS[0]);
  await newTodoInput.press("Enter");
  await newTodoInput.fill(TODO_ITEMS[1]);
  await newTodoInput.press("Enter");
  await newTodoInput.fill(TODO_ITEMS[2]);
  await newTodoInput.press("Enter");

  // Make sure the list now has all todo items.
  await expect(page.getByText(TODO_ITEMS[0])).toBeVisible();
  await expect(page.getByText(TODO_ITEMS[1])).toBeVisible();
  await expect(page.getByText(TODO_ITEMS[2])).toBeVisible();

  //mark one item as completed
  const checklistButton = page.locator("(//button[@aria-label='done'])[2]");
  await checklistButton.click();

  //edit one item
  const itemToEdit = page.getByText(TODO_ITEMS[1]);

  await itemToEdit.click();
  await page.getByRole("textbox").nth(1).fill("");
  await page.getByRole("textbox").nth(1).fill("Buy plant-based milk");
  await page.getByRole("textbox").nth(1).press("Enter");

  await sleep(5000);

  //cards locators
  const addedItems = page.locator(
    "//dt[normalize-space()='Added']/following-sibling::dd[1]"
  );
  const completedItems = page.locator(
    "//dt[normalize-space()='Completed']/following-sibling::dd[1]"
  );
  const editedItems = page.locator(
    "//dt[normalize-space()='Edited']/following-sibling::dd[1]"
  );

  //assert
  await expect(addedItems).toContainText("3 items");
  await expect(completedItems).toContainText("1 items");
  await expect(editedItems).toContainText("1 times");
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
