import { test, expect } from '@playwright/test';

// Phase 1: Core Engine E2E Tests
test('Phase 1: Happy Path - 100k @ 12% for 12 months', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page).toHaveTitle('Loan EMI Calculator');
  
  await page.fill('input[id="principal"]', '100000');
  await page.fill('input[id="annualRate"]', '12');
  await page.fill('input[id="months"]', '12');
  await page.click('button[type="submit"]');
  
  await page.waitForSelector('text=Monthly EMI:');
  await expect(page.locator('text=Monthly EMI:')).toBeVisible();
  await expect(page.locator('text=Total Amount to Pay:')).toBeVisible();
  await expect(page.locator('text=Total Interest:')).toBeVisible();
});

test('Phase 1: Validation - Reject zero principal', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  await page.fill('input[id="principal"]', '0');
  await page.fill('input[id="annualRate"]', '10');
  await page.fill('input[id="months"]', '12');
  await page.click('button[type="submit"]');
  
  const errorMsg = page.locator('.error-message');
  const results = page.locator('.results');
  const hasError = await errorMsg.isVisible().catch(() => false);
  const hasResults = await results.isVisible().catch(() => false);
  
  expect(hasError || !hasResults).toBe(true);
});

test('Phase 1: Benchmark accuracy verification', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  await page.fill('input[id="principal"]', '100000');
  await page.fill('input[id="annualRate"]', '12');
  await page.fill('input[id="months"]', '12');
  await page.click('button[type="submit"]');
  
  await page.waitForSelector('text=Monthly EMI:');
  const emiText = await page.locator('.results .result-value').first().textContent();
  const emiValue = parseFloat(emiText?.replace(/[₹,]/g, '') || '0');
  
  expect(Math.abs(emiValue - 8884.88)).toBeLessThan(0.5);
});

// Phase 2: UI/UX Real-time Feedback Tests (RED Phase - These will fail until Phase 2 is implemented)
test('Phase 2 [FAILING]: Real-time feedback display', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  await page.fill('input[id="principal"]', '150000');
  
  // This test expects Phase 2 implementation
  const feedback = page.locator('[data-testid="real-time-feedback"]');
  await expect(feedback).toBeVisible();
});

test('Phase 2 [FAILING]: Highlight invalid fields immediately', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  await page.fill('input[id="principal"]', '-50000');
  
  // This test expects Phase 2 implementation
  const principalInput = page.locator('input[id="principal"]');
  const hasErrorClass = await principalInput.evaluate(el => 
    el.classList.contains('input-error')
  );
  
  expect(hasErrorClass).toBe(true);
});

test('Phase 2 [FAILING]: Show formatted currency in real-time', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  
  await page.fill('input[id="principal"]', '1000000');
  await page.fill('input[id="annualRate"]', '10');
  await page.fill('input[id="months"]', '60');
  
  // Should show formatted result like "₹20,000.00"
  const resultsDisplay = page.locator('.results');
  const hasFormatting = await resultsDisplay.evaluate(el => 
    el.textContent?.includes(',') || false
  );
  
  expect(hasFormatting).toBe(true);
});

test('Phase 2 [FAILING]: Live calculation without submit', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  
  await page.fill('input[id="principal"]', '200000');
  await page.fill('input[id="annualRate"]', '8');
  await page.fill('input[id="months"]', '36');
  
  await page.waitForTimeout(500);
  
  // Results should appear without clicking submit (Phase 2 feature)
  const results = page.locator('.results');
  await expect(results).toBeVisible();
});

// Phase 3/4: Accessibility Tests (RED Phase - These will fail until Phase 3/4 is implemented)
test('Phase 3/4 [FAILING]: ARIA labels for form fields', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  
  const principalInput = page.locator('input[id="principal"]');
  const hasAriaLabel = await principalInput.evaluate(el => 
    el.hasAttribute('aria-label') || el.hasAttribute('aria-describedby')
  );
  
  expect(hasAriaLabel).toBe(true);
});

test('Phase 3/4 [FAILING]: Keyboard navigation', async ({ page }) => {
  test.skip();
  await page.goto('http://localhost:5173');
  
  await page.keyboard.press('Tab');
  let focusedElement = await page.evaluate(() => document.activeElement?.id);
  expect(focusedElement).toBeDefined();
  
  await page.keyboard.press('Tab');
  focusedElement = await page.evaluate(() => document.activeElement?.id);
  expect(focusedElement).toBeDefined();
});
