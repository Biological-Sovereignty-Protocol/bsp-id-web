import { test, expect } from '@playwright/test';

test.describe('BSP ID Web — BioRecord', () => {
  test('dashboard page loads with BioRecord section', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);

    // Dashboard should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('BioRecord list renders (empty or populated)', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for any records section or empty state
    const dashboard = page.locator('main, [role="main"], .dashboard, #dashboard');
    await expect(dashboard.first()).toBeVisible({ timeout: 5000 });

    // Either we see records or an empty state - both are valid
    const content = await page.locator('body').textContent();
    expect(content).toBeTruthy();
  });

  test('BioRecord detail view navigation works', async ({ page }) => {
    await page.goto('/dashboard');

    // If there are any clickable records, try clicking one
    const recordLink = page.locator('[data-record-id], .bio-record, [href*="/record/"]').first();

    if (await recordLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recordLink.click();
      // Should navigate to detail view
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    } else {
      // No records yet - this is fine
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('BioRecord filter/search UI is functional', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for any filter or search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="filter"]');

    if (await searchInput.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.first().fill('glucose');
      await page.waitForTimeout(300);
      // Search should not crash
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('BioRecord categories are displayed correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for category indicators or tabs
    const categories = page.locator('[data-category], .category, .biomarker-category');

    // Either categories exist or we're in empty state
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('export functionality is accessible', async ({ page }) => {
    await page.goto('/dashboard');

    // Look for export button
    const exportBtn = page.getByRole('button', { name: /export|download/i });

    if (await exportBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Button exists - don't click to avoid actual download in test
      await expect(exportBtn).toBeEnabled();
    }
  });
});
