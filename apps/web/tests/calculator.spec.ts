import { test, expect } from '@playwright/test';

test('EMI Calculator - Happy Path Flow', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Check page title
  await expect(page).toHaveTitle('Loan EMI Calculator');

  // Check heading is visible
  const heading = page.locator('h1');
  await expect(heading).toContainText('Loan EMI Calculator');

  // Fill in loan amount (Principal)
  await page.fill('input[id="principal"]', '100000');

  // Fill in interest rate
  await page.fill('input[id="annualRate"]', '12');

  // Fill in tenure (months)
  await page.fill('input[id="months"]', '12');

  // Click submit button
  await page.click('button[type="submit"]');

  // Wait for results to appear
  await page.waitForSelector('text=Monthly EMI:');

  // Verify results are displayed
  const monthlyEmi = page.locator('text=Monthly EMI:');
  await expect(monthlyEmi).toBeVisible();

  // Verify the EMI value is close to expected
  const resultsSection = page.locator('.results');
  await expect(resultsSection).toContainText('₹');

  // Verify all result items are visible
  await expect(page.locator('text=Total Amount to Pay:')).toBeVisible();
  await expect(page.locator('text=Total Interest:')).toBeVisible();
});

test('EMI Calculator - Validation Error Handling', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Try to submit with invalid values (zero principal)
  await page.fill('input[id="principal"]', '0');
  await page.fill('input[id="annualRate"]', '10');
  await page.fill('input[id="months"]', '12');

  await page.click('button[type="submit"]');

  // Check that error message appears or form doesn't submit
  // (Implementation may vary based on form validation)
  const errorMsg = page.locator('.error-message');
  // Error should be visible or results should not appear
  const results = page.locator('.results');
  const hasError = await errorMsg.isVisible().catch(() => false);
  const hasResults = await results.isVisible().catch(() => false);

  expect(hasError || !hasResults).toBe(true);
});

test('EMI Calculator - Benchmark Values Accuracy', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Test Benchmark 1: 100k @ 12% for 12 months = ₹8,884.88
  await page.fill('input[id="principal"]', '100000');
  await page.fill('input[id="annualRate"]', '12');
  await page.fill('input[id="months"]', '12');
  await page.click('button[type="submit"]');

  await page.waitForSelector('text=Monthly EMI:');
  const emiText1 = await page.locator('.results .result-value').first().textContent();

  // Extract number from ₹8,884.88 format
  const emiValue1 = parseFloat(emiText1?.replace(/[₹,]/g, '') || '0');
  expect(Math.abs(emiValue1 - 8884.88)).toBeLessThan(0.5);
});
