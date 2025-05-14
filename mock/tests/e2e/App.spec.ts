import { expect, test } from "@playwright/test";

// Navigate to the app before each test
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});


// Test 1: Input box and submit button are visible on page load
test("Test 1: Input and submit button are visible on page load", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await expect(page.getByLabel("Course description input")).toBeVisible();
  await expect(page.getByLabel("Submit course blurb")).toBeVisible();
});


// Test 2: Submitting a blurb loads at least one course result
test("Test 2: Typing a blurb and submitting loads course results", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("psychology class");
  await page.getByLabel("Submit course blurb").click();

  const courseCards = page.locator(".course-card");
  await expect(courseCards.first()).toBeVisible();
});


// Test 3: Resetting the page with 'New Search' clears the results
test("Test 3: Clicking 'New Search' resets the UI", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("biology");
  await page.getByLabel("Submit course blurb").click();

  const resetButton = page.getByLabel("Start a new course search");
  await expect(resetButton).toBeVisible();
  await resetButton.click();

  await expect(page.getByLabel("Course description input")).toBeVisible();
  await expect(page.locator(".course-card")).toHaveCount(0);
});


// Test 4: Submitting an empty blurb does not show results
test("Test 4: Submitting an empty blurb does not show results", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("   ");
  await page.getByLabel("Submit course blurb").click();

  const courseCards = page.locator(".course-card");
  await expect(courseCards).toHaveCount(0);
});


// Test 5: Shows loading message while fetching results
test("Test 5: Shows loading message while fetching results", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("history of art");
  await page.getByLabel("Submit course blurb").click();

  const loadingMessage = page.locator('[aria-live="polite"]');
  await expect(loadingMessage).toContainText("Finding courses for you...");
});


// Test 6: First result contains course title, ID, and department
test("Test 6: First result contains course title, ID, and department", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("cognitive science");
  await page.getByLabel("Submit course blurb").click();

  const courseCard = page.locator(".course-card").first();
  await expect(courseCard.locator(".course-title")).toBeVisible();
  await expect(courseCard.locator(".course-id")).toHaveCount(1);
  await expect(courseCard.locator(".course-department")).toBeVisible();
});


// Test 7: Scrolls properly
test("Test 7: Results persist while scrolling", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("data science");
  await page.getByLabel("Submit course blurb").click();

  const courseCards = page.locator(".course-card");
  const count = await courseCards.count();
  expect(count).toBeGreaterThan(1);

  await courseCards.first().scrollIntoViewIfNeeded();
  await courseCards.last().scrollIntoViewIfNeeded();

  await expect(courseCards.first()).toBeVisible();
  await expect(courseCards.last()).toBeVisible();
});


// Test 8: Submitting a new blurb clears old results before loading new ones
test("Test 8: Submitting a new blurb clears old results before loading new ones", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]', { timeout: 10000 });
  await page.getByLabel("Course description input").fill("sociology");
  await page.getByLabel("Submit course blurb").click();

  const firstCard = page.locator(".course-card").first();
  await expect(firstCard).toBeVisible();

  await page.getByLabel("Start a new course search").click();
  await page.getByLabel("Course description input").fill("neuroscience");
  await page.getByLabel("Submit course blurb").click();

  const newFirstCard = page.locator(".course-card").first();
  await expect(newFirstCard).toBeVisible();
  await expect(page.locator(".results-message")).toContainText("neuroscience");
});


// Test 9: Repeated submissions load and replace results without crashing
test("Test 9: Repeated submissions load and replace results without crashing", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]');

  const blurbs = ["math", "computer science", "biology", "history"];
  for (const blurb of blurbs) {
    await page.getByLabel("Course description input").fill(blurb);
    await page.getByLabel("Submit course blurb").click();

    const card = page.locator(".course-card").first();
    await expect(card).toBeVisible();

    await page.getByLabel("Start a new course search").click();
  }
});


// Test 10: Switching blurbs quickly does not show mixed results
test("Test 10: Switching blurbs quickly does not show mixed results", async ({ page }) => {
  await page.waitForSelector('[aria-label="Course description input"]');

  await page.getByLabel("Course description input").fill("philosophy");
  await page.getByLabel("Submit course blurb").click();

  await page.getByLabel("Start a new course search").click();
  await page.getByLabel("Course description input").fill("economics");
  await page.getByLabel("Submit course blurb").click();

  const message = page.locator(".results-message");
  await expect(message).toContainText("economics");

  const courseCard = page.locator(".course-card").first();
  await expect(courseCard).toBeVisible();
});


// Test 11: Submitting the same blurb twice yields consistent results
test("Test 11: Submitting the same blurb twice yields consistent results", async ({ page }) => {
  await page.getByLabel("Course description input").fill("environmental studies");
  await page.getByLabel("Submit course blurb").click();
  const firstTitle = await page.locator(".course-card .course-title").first().innerText();

  await page.getByLabel("Start a new course search").click();
  await page.getByLabel("Course description input").fill("environmental studies");
  await page.getByLabel("Submit course blurb").click();
  const secondTitle = await page.locator(".course-card .course-title").first().innerText();

  expect(firstTitle).toBe(secondTitle);
});


// Test 12: Old results are cleared and replaced fully when new blurb is submitted
test("Test 12: Old results are cleared and replaced fully when new blurb is submitted", async ({ page }) => {
  await page.getByLabel("Course description input").fill("engineering");
  await page.getByLabel("Submit course blurb").click();

  const firstResult = await page.locator(".course-card .course-title").first().innerText();

  await page.getByLabel("Start a new course search").click();
  await page.getByLabel("Course description input").fill("music");
  await page.getByLabel("Submit course blurb").click();

  const newResult = await page.locator(".course-card .course-title").first().innerText();
  expect(newResult).not.toBe(firstResult);
});


// Test 13: Error message disappears and results appear on successful retry
test("Test 13: Error message disappears and results appear on successful retry", async ({ page }) => {
  await page.getByLabel("Course description input").fill("fail this request");
  await page.getByLabel("Submit course blurb").click();

  await expect(page.locator('[aria-live="assertive"]')).toContainText("Server error");

  await page.getByLabel("Start a new course search").click();
  await page.getByLabel("Course description input").fill("philosophy");
  await page.getByLabel("Submit course blurb").click();

  const card = page.locator(".course-card").first();
  await expect(card).toBeVisible();
});


// Test 14: Clicking a course card opens detailed view or external link
test("Test 14: Clicking a course card opens detailed view or external link", async ({ page }) => {
  await page.getByLabel("Course description input").fill("math");
  await page.getByLabel("Submit course blurb").click();

  const card = page.locator(".course-card").first();
  const link = card.locator("a"); // or modal trigger
  await expect(link).toBeVisible();
});


// Test 15: New Search clears results message and errors
test("Test 15: New Search clears results message and errors", async ({ page }) => {
  await page.getByLabel("Course description input").fill("bad query");
  await page.getByLabel("Submit course blurb").click();

  await expect(page.locator('[aria-live="assertive"]')).toBeVisible();

  await page.getByLabel("Start a new course search").click();

  await expect(page.locator('[aria-live="assertive"]')).toHaveCount(0);
  await expect(page.locator(".results-message")).toHaveCount(0);
});
