import { test, expect } from '@playwright/test';

// E2E test for Loan EMI Calculator UI

test.describe('Loan EMI Calculator Form', () => {
  test('calculates EMI and displays result', async ({ page }) => {
    await page.goto('/'); // Adjust if your route is different

    // Fill in Principal
    await page.getByLabel('Principal Amount (ZMW)').fill('100000');
    // Fill in Annual Rate
    await page.getByLabel('Annual Interest Rate (%)').fill('12');
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
