import { test, expect } from '@playwright/test';

// This E2E test is designed to run in CI without Firestore by intercepting the
// network call to the tRPC endpoint and asserting the payload that would be sent.

test('web UI calculates EMI and calls logCalculation (intercept)', async ({ page }) => {
  // Intercept any POST containing 'logCalculation' in the url
  let intercepted = false;
  let payloadBody: any = null;

  await page.route('**/*', async (route) => {
    const req = route.request();
    const url = req.url();
    if (req.method() === 'POST' && url.includes('logCalculation')) {
      intercepted = true;
      const body = req.postData();
      if (body) {
        try {
          payloadBody = JSON.parse(body);
        } catch (e) {
          payloadBody = body;
        }
      }
      // Mock success response
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, id: 'mock-id' }) });
      return;
    }
    await route.continue();
  });

  // Replace with the local dev server URL if different
  await page.goto('http://localhost:5173');

  // Minimal interactions: set principal, rate, months and submit
  await page.fill('input[name="principal"]', '10000');
  await page.fill('input[name="monthlyRate"]', '20');
  await page.fill('input[name="months"]', '12');
  await page.click('button[type="submit"]');

  // Give the route a moment to be triggered
  await page.waitForTimeout(250);

  expect(intercepted).toBeTruthy();
  // Basic shape assertions (frontend formats monthlyEMI => formattedMonthlyEMI)
  expect(payloadBody).toBeTruthy();
  expect(payloadBody).toHaveProperty('principal', 10000);
  expect(payloadBody).toHaveProperty('monthlyRate', 20);
  expect(payloadBody).toHaveProperty('months', 12);
  expect(payloadBody).toHaveProperty('monthlyEMI');
  expect(payloadBody).toHaveProperty('formattedMonthlyEMI');
  expect(payloadBody.currency).toBe('ZMW');
});
// E2E test for Loan EMI Calculator UI

test.describe('Loan EMI Calculator Form', () => {
  test('calculates EMI and displays result', async ({ page }) => {
    await page.goto('/'); // Adjust if your route is different

    // Fill in Principal
    await page.getByLabel('Principal Amount (ZMW)').fill('100000');
    // Fill in Annual Rate
    await page.getByLabel('Monthly Interest Rate (%)').fill('1');
    // Fill in Tenure
    await page.getByLabel('Tenure (Months)').fill('12');

    // Submit the form
    await page.getByRole('button', { name: /calculate monthly emi/i }).click();

    // Wait for result to appear
    await expect(page.getByText(/your estimated monthly installment/i)).toBeVisible();
    await expect(page.getByText(/K 8,884.88/)).toBeVisible(); // Benchmark value
  });

  test('shows validation error for negative input', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Principal Amount (ZMW)').fill('-1000');
    await page.getByRole('button', { name: /calculate monthly emi/i }).click();
    await expect(page.getByText(/principal is required/i)).toBeVisible();
  });

  test('shows validation error for empty fields', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /calculate monthly emi/i }).click();
    await expect(page.getByText(/principal is required/i)).toBeVisible();
    await expect(page.getByText(/rate must be positive/i)).toBeVisible();
    await expect(page.getByText(/tenure must be at least 1 month/i)).toBeVisible();
  });
});
