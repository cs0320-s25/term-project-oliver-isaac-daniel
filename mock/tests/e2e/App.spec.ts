import { expect, test } from "@playwright/test";

// Navigate to the app
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8001/");
});

// Test 1: Verify Login button visibility on page load
test("on page load, I see a login button", async ({ page }) => {
  await expect(page.getByLabel("Login")).toBeVisible();
});

// Test 2: Verify that the input box is not visible until login
test("on page load, I don't see the input box until login", async ({ page }) => {
  await expect(page.getByLabel("Sign Out")).not.toBeVisible();
  await expect(page.getByLabel("dropdown")).not.toBeVisible();

  // Click the login button to trigger visibility change
  await page.getByLabel("Login").click();
  await expect(page.getByLabel("Sign Out")).toBeVisible();
  await expect(page.getByLabel("Select a dataset")).toBeVisible();
});

// Test 3: Check if dropdown for dataset selection is visible after login
test("on login, dropdown for selecting datasets should be visible", async ({ page }) => {
  await page.getByLabel("Login").click();  // Log in
  await expect(page.getByLabel("Select a dataset")).toBeVisible();
});

// Test 4: Ensure correct dataset is displayed in SelectHistory after submission
test("when I select a dataset and submit, I see the corresponding data", async ({ page }) => {
  await page.getByLabel("Login").click();  // Log in

  // Select and submit 'Listings'
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();

  // Ensure that the 'Listings' data appears in the history
  const listingsTable = page.locator('.select-history table').first(); // Target the first table for Listings

  // Check individual values for 'Listings'
  const listingsData = [
    "123 Main St", "450000", "3", "2", "1800", "Single Family"
  ];

  for (const expectedText of listingsData) {
    await expect(listingsTable).toContainText(expectedText);
  }
});

// Test 5: Switch datasets and verify history is updated correctly
test("when I select multiple datasets, I see the history updated correctly", async ({ page }) => {
  await page.getByLabel("Login").click();  // Log in

  // Select and submit 'Listings'
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();

  // Select and submit 'Agents'
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();

  // Ensure 'Listings' dataset is in the first table in the history
  const listingsTable = page.locator('.select-history table').first(); // Target the first table
  const listingsData = [
    "123 Main St", "450000", "3", "2", "1800", "Single Family"
  ];
  for (const expectedText of listingsData) {
    await expect(listingsTable).toContainText(expectedText);
  }

  // Ensure 'Agents' dataset is in the second table in the history
  const agentsTable = page.locator('.select-history table').nth(1); // Target the second table
  const agentsData = [
    "John Smith", "555-1234", "john@realestate.com", "12"
  ];
  for (const expectedText of agentsData) {
    await expect(agentsTable).toContainText(expectedText);
  }
});



// Test 6: Check if selecting a third dataset updates history correctly
test("when I select a third dataset, the history continues to update", async ({ page }) => {
  await page.getByLabel("Login").click();  // Log in

  // Select and submit 'Listings'
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();

  // Select and submit 'Agents'
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();

  // Select and submit 'Longer List'
  await page.selectOption('select#dropdown', { label: 'Longer List' });
  await page.getByLabel("Submit").click();

  // Verify the 'Listings' dataset in the first table
  const listingsTable = page.locator('.select-history table').first(); // First table for Listings
  const listingsData = [
    "123 Main St", "450000", "3", "2", "1800", "Single Family"
  ];
  for (const expectedText of listingsData) {
    await expect(listingsTable).toContainText(expectedText);
  }

  // Verify the 'Agents' dataset in the second table
  const agentsTable = page.locator('.select-history table').nth(1); // Second table for Agents
  const agentsData = [
    "John Smith", "555-1234", "john@realestate.com", "12"
  ];
  for (const expectedText of agentsData) {
    await expect(agentsTable).toContainText(expectedText);
  }

  // Verify the 'Longer List' dataset in the third table
  const longerListTable = page.locator('.select-history table').nth(2); // Third table for Longer List
  const longerListData = [
    "123 Main St", "450000", "3", "2", "1800", "Single Family"
  ];
  for (const expectedText of longerListData) {
    await expect(longerListTable).toContainText(expectedText);
  }
});


// Test 7: State change in currently loaded data (load_csv command simulation)
test("state changes correctly when loading multiple datasets in sequence", async ({ page }) => {
  await page.getByLabel("Login").click(); // Log in
  
  // 1. Load first dataset
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();
  
  // Verify initial state - first dataset is loaded and displayed in table format
  let tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(1);
  await expect(tables.first()).toContainText("123 Main St");
  await expect(tables.first()).toContainText("450000");
  
  // 2. Load second dataset
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();
  
  // Verify state update - both datasets are displayed
  tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(2);
  await expect(tables.first()).toContainText("123 Main St");
  await expect(tables.nth(1)).toContainText("John Smith");
  
  // 3. Load first dataset again (to test A → B → A pattern)
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();
  
  // Verify state after loading the same dataset again - all three datasets should be visible
  tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(3);
  await expect(tables.first()).toContainText("123 Main St");  // First Listings
  await expect(tables.nth(1)).toContainText("John Smith");    // Agents
  await expect(tables.nth(2)).toContainText("123 Main St");   // Second Listings
});

// Test 8: Testing different shapes of data visualization with state changes
test("visualization mode changes correctly between table and chart views", async ({ page }) => {
  await page.getByLabel("Login").click(); // Log in
  
  // 1. Load first dataset
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();
  
  // Verify table view by default
  await expect(page.locator('.select-history table')).toBeVisible();
  await expect(page.locator('.chart-container')).not.toBeVisible();
  
  // 2. Switch to chart view
  await page.getByRole('button', { name: /Switch to Chart View/i }).click();
  
  // Verify chart view is active
  await expect(page.locator('.chart-container')).toBeVisible();
  await expect(page.locator('.select-history table')).not.toBeVisible();
  
  // 3. Load second dataset
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();
  
  // Verify both datasets are in chart view
  let chartContainers = page.locator('.chart-container');
  await expect(chartContainers).toHaveCount(2);
  
  // 4. Switch back to table view
  await page.getByRole('button', { name: /Switch to Table View/i }).click();
  
  // Verify both datasets are now in table view
  let tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(2);
  await expect(chartContainers).not.toBeVisible();
});

// Test 9: Testing from different reachable states with overwriting changes
test("complex state transitions with view changes and multiple datasets (A → B → A pattern)", async ({ page }) => {
  await page.getByLabel("Login").click(); // Log in
  
  // 1. Load dataset A (Listings)
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();
  
  // Verify initial state - table view
  await expect(page.locator('.select-history table')).toBeVisible();
  
  // 2. Switch to chart view
  await page.getByRole('button', { name: /Switch to Chart View/i }).click();
  await expect(page.locator('.chart-container')).toBeVisible();
  
  // 3. Load dataset B (Agents)
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();
  
  // Verify both datasets are in chart view
  let chartContainers = page.locator('.chart-container');
  await expect(chartContainers).toHaveCount(2);
  
  // 4. Switch back to table view
  await page.getByRole('button', { name: /Switch to Table View/i }).click();
  
  // Verify both datasets are in table view
  let tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(2);
  
  // 5. Load dataset A again (Listings)
  await page.selectOption('select#dropdown', { label: 'Listings' });
  await page.getByLabel("Submit").click();
  
  // Verify all three datasets are in table view (A → B → A pattern)
  tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(3);
  
  // 6. Switch to chart view
  await page.getByRole('button', { name: /Switch to Chart View/i }).click();
  
  // Verify all three datasets are now in chart view
  chartContainers = page.locator('.chart-container');
  await expect(chartContainers).toHaveCount(3);
  
  // 7. Load dataset B again (Agents)
  await page.selectOption('select#dropdown', { label: 'Agents' });
  await page.getByLabel("Submit").click();
  
  // Verify all four datasets are in chart view (A → B → A → B pattern)
  chartContainers = page.locator('.chart-container');
  await expect(chartContainers).toHaveCount(4);
  
  // 8. Switch back to table view one final time
  await page.getByRole('button', { name: /Switch to Table View/i }).click();
  
  // Verify all four datasets are in table view
  tables = page.locator('.select-history table');
  await expect(tables).toHaveCount(4);
});


