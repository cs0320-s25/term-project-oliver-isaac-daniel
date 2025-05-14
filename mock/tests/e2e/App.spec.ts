import { test, expect } from "@playwright/test";

// Before each test, navigate to the course search app
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8004/");
});

// Test 1: On load, input and submit button are visible
test("on page load, input and submit button are visible", async ({ page }) => {
  await expect(page.getByRole("textbox", { name: "Course description input" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit course blurb" })).toBeVisible();
});

// Test 2: Submitting an empty blurb does not crash or submit
test("empty submission does not crash or submit", async ({ page }) => {
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByRole("textbox", { name: "Course description input" })).toBeVisible();
  await expect(page.locator(".course-card")).toHaveCount(0);
});

// Test 3: Submitting a valid course blurb shows results
test("submitting a valid course blurb shows results", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("I want a chill CS class");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start a new course search" })).toBeVisible();
});

// Test 4: Reset button returns to blurb input
test("reset button returns to blurb input", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("Intro to Econ class");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await page.getByRole("button", { name: "Start a new course search" }).click();
  await expect(page.getByRole("textbox", { name: "Course description input" })).toBeVisible();
  await expect(page.locator(".course-card")).toHaveCount(0);
});

// Test 5: Submitting a long descriptive blurb works without crashing
test("handles long complex blurb input gracefully", async ({ page }) => {
  const longBlurb =
    "I am looking for an anthropology class but I am also interested in exploring how technology intersects with human behavior, culture, and ethics.";
  await page.getByRole("textbox", { name: "Course description input" }).fill(longBlurb);
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();
});

// Test 6: CAB external link opens in new tab
test("CAB external link opens in new tab", async ({ page, context }) => {
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: "Courses at Brown (CAB) website" }).click(),
  ]);
  await newPage.waitForLoadState();
  await expect(newPage).toHaveURL(/cab\.brown\.edu/);
});

// Test 7: Submitting gibberish still shows fallback or mock data
test("submitting nonsense input shows fallback or mock results", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("asdf1234!@#$qwerty");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start a new course search" })).toBeVisible();
});

// Test 8: Submitting the same blurb twice returns consistent results
test("submitting the same blurb twice works consistently", async ({ page }) => {
  const blurb = "introductory machine learning";
  await page.getByRole("textbox", { name: "Course description input" }).fill(blurb);
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();

  await page.getByRole("button", { name: "Start a new course search" }).click();

  await page.getByRole("textbox", { name: "Course description input" }).fill(blurb);
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();
});

// Test 9: Refreshing the page after submission resets the app
test("refreshing the page after submission resets the app", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("robotics");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText("These are your results for:")).toBeVisible();

  await page.reload();
  await expect(page.getByRole("textbox", { name: "Course description input" })).toBeVisible();
  await expect(page.getByText("These are your results for:")).not.toBeVisible();
});

// Test 10: Keyboard-only navigation from input to submit
test("can tab from input to submit and trigger with Enter", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).focus();
  await page.keyboard.type("data structures and algorithms");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByText("These are your results for:")).toBeVisible();
});

// Test 11: Input field clears after successful submission
test("input field clears after successful submission", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("environmental engineering");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await page.getByRole("button", { name: "Start a new course search" }).click();
  await expect(page.getByRole("textbox", { name: "Course description input" })).toHaveValue("");
});

// Test 12: Error fallback shows when backend fails/ or is not running
test("shows error message when backend is unavailable", async ({ page }) => {
  await page.route("**/score", (route) => route.abort());
  await page.getByRole("textbox", { name: "Course description input" }).fill("finance");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText(/Server error/)).toBeVisible();
});

// Test 13: Displays 'no results' message for unsupported input
test("displays 'no results' message for unsupported input", async ({ page }) => {
  await page.route("**/score", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ results: [] }),
    });
  });

  await page.getByRole("textbox", { name: "Course description input" }).fill("madeupsubjectxyz");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.getByText(/No courses found for:/)).toBeVisible();
});

// Test 14: Shows loading message while fetching results
test("shows loading message while fetching results", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("history of art");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText("Finding courses for you...");
});

// Test 15: Switching blurbs quickly shows correct results
test("switching blurbs quickly does not show mixed results", async ({ page }) => {
  await page.getByRole("textbox", { name: "Course description input" }).fill("philosophy");
  await page.getByRole("button", { name: "Submit course blurb" }).click();

  await page.getByRole("button", { name: "Start a new course search" }).click();
  await page.getByRole("textbox", { name: "Course description input" }).fill("economics");
  await page.getByRole("button", { name: "Submit course blurb" }).click();

  await expect(page.locator(".results-message")).toContainText("economics");
});

// Test 16: New search clears error and result messages
test("New Search clears error and result messages", async ({ page }) => {
  await page.route("**/score", (route) => route.abort());
  await page.getByRole("textbox", { name: "Course description input" }).fill("bad query");
  await page.getByRole("button", { name: "Submit course blurb" }).click();
  await expect(page.locator('[aria-live="assertive"]')).toBeVisible();

  await page.getByRole("button", { name: "Start a new course search" }).click();
  await expect(page.locator('[aria-live="assertive"]')).toHaveCount(0);
  await expect(page.locator(".results-message")).toHaveCount(0);
});
