const { test, expect } = require("@playwright/test");
const { exec } = require("child_process");

let server;

test.beforeEach(async ({ page }) => {
  // Start your server
  server = exec("npm run dev"); // Replace with the command to start your server

  // Wait for the server to start
  await new Promise((resolve) => setTimeout(resolve, 5173)); // Adjust as needed

  // go to page
  await page.goto("http://localhost:5173");
  page.on("console", (msg) =>
    console.log(`Browser log: ${msg.type()}: ${msg.text()}`),
  );
});

test.afterEach(async () => {
  // Stop your server
  server.kill();
});

test("clicking add-timer-button adds a new timer, clicking remove button removes timer", async ({
  page,
}) => {
  // dismiss popover welcome-close
  await page.click("button#welcome-close");

  // Check that there is initially one timer container
  const initialTimerContainers = await page
    .locator('div[class*="timer-container"]')
    .count();
  expect(initialTimerContainers).toBe(1);

  // Press the button to add a new timer
  await page.locator('div[id*="add-timer-button"]').click();

  // Check that a new timer container has been added
  const timerContainersAfterClick = await page
    .locator('div[class*="timer-container"]')
    .count();
  expect(timerContainersAfterClick).toBe(2);

  // focus on new timer, delete
  const timerToRemove = page.locator("#my-timer-1");
  await timerToRemove.focus();

  // Click the remove timer button
  await page.locator('div[id*="remove-timer-button"]').click();

  // Wait for 2 seconds
  await page.waitForTimeout(2000);

  // Check the count of timer containers after the click
  const timerContainersAfterClickAgain = await page
    .locator('div[class*="timer-container"]')
    .count();
  expect(timerContainersAfterClickAgain).toBe(1);
});

test("save timer name notes and verify persistence", async ({ page }) => {
  // dismiss popover welcome-close
  await page.click("button#welcome-close");

  // Check that there is initially one timer container
  const initialTimerContainers = await page
    .locator('div[class*="timer-container"]')
    .count();
  expect(initialTimerContainers).toBe(1);

  // Check that the div with id my-timer-1 exists
  const initTimerDiv = page.locator("#my-timer-1");

  // Assert that the element is visible (exists in the DOM)
  await expect(initTimerDiv).toBeVisible();

  // check local storage
  const myTimer1ValueInit = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("todo-timers-app")),
  );
  expect(myTimer1ValueInit).toBe(null);

  // Enter data into timer name
  const timerNameInput = page.locator("#timer-name");
  await timerNameInput.focus();

  const nameText = "This is a test name.";
  await timerNameInput.fill(nameText);

  // Focus on the input element with id timer-notes
  const timerNotesInput = page.locator("#timer-notes");
  await timerNotesInput.focus();

  const notesText = "This is a test note.";
  await timerNotesInput.fill(notesText);

  // Click the save button
  await page.locator('div[id*="save-button"]').click();
  await page.waitForTimeout(500);

  // await page.screenshot({ path: "test_shot_1.png" });

  // check local storage
  const myTimer1ValuesBefore = await page.evaluate(
    () => JSON.parse(localStorage.getItem("todo-timers-app"))["my-timer-1"],
  );
  const myTimer1NameBefore = myTimer1ValuesBefore["timerName"];
  expect(myTimer1NameBefore.trim()).toBe(nameText);
  const myTimer1NotesBefore = myTimer1ValuesBefore["timerNotes"];
  expect(myTimer1NotesBefore.trim()).toBe(notesText);

  // Refresh the page
  await page.reload();

  // Check that there is initially one timer container
  const afterTimerContainers = await page
    .locator('div[class*="timer-container"]')
    .count();
  expect(afterTimerContainers).toBe(1);

  // Check that the div with id my-timer-1 exists
  const afterTimerDiv = page.locator("#my-timer-1");

  // Assert that the element is visible (exists in the DOM)
  await expect(afterTimerDiv).toBeVisible();

  // await page.screenshot({ path: "test_shot_2.png" });

  // check local storage
  const myTimer1ValuesAfter = await page.evaluate(
    () => JSON.parse(localStorage.getItem("todo-timers-app"))["my-timer-1"],
  );
  const myTimer1NameAfter = myTimer1ValuesAfter["timerName"];
  expect(myTimer1NameAfter.trim()).toBe(nameText);
  const myTimer1NotesAfter = myTimer1ValuesAfter["timerNotes"];
  expect(myTimer1NotesAfter.trim()).toBe(notesText);

  // Check that the text still exists in the timer-notes div
  const timerNameOutput = page.locator("#timer-name"); // Adjust if necessary
  const timerNameText = await timerNameOutput.inputValue();
  expect(timerNameText.trim()).toBe(nameText);

  const timerNotesOutput = page.locator("#timer-notes"); // Adjust if necessary
  const timerNotesText = await timerNotesOutput.inputValue();
  expect(timerNotesText.trim()).toBe(notesText);
});
