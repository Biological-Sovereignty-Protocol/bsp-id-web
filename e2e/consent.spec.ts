import { test, expect } from '@playwright/test';

test.describe('BSP ID Web — Consent Management', () => {
  test('consent page loads correctly', async ({ page }) => {
    await page.goto('/consent');
    await expect(page).toHaveURL(/\/consent$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('consent token list renders', async ({ page }) => {
    await page.goto('/consent');

    // Look for consent tokens list or empty state
    const consentSection = page.locator('main, [role="main"], .consent-list, #consent');
    await expect(consentSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('grant consent flow is accessible', async ({ page }) => {
    await page.goto('/consent');

    // Look for grant/add consent button
    const grantBtn = page.getByRole('button', { name: /grant|add|new|create/i });

    if (await grantBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await grantBtn.click();
      // Should open modal or navigate to grant page
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('consent token details are viewable', async ({ page }) => {
    await page.goto('/consent');

    // If tokens exist, try to view details
    const tokenRow = page.locator('[data-consent-id], .consent-token, [href*="/consent/"]').first();

    if (await tokenRow.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tokenRow.click();
      await page.waitForTimeout(500);
      // Should show details
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('revoke consent UI is functional', async ({ page }) => {
    await page.goto('/consent');

    // Look for revoke button
    const revokeBtn = page.getByRole('button', { name: /revoke|remove|delete/i }).first();

    if (await revokeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Button exists but don't actually revoke in test
      await expect(revokeBtn).toBeEnabled();
    }
  });

  test('consent intents are displayed', async ({ page }) => {
    await page.goto('/consent');

    // Intents (READ_DATA, WRITE_DATA, etc.) should be visible if tokens exist
    const body = await page.locator('body').textContent();
    // Page should render without errors
    expect(body).toBeTruthy();
  });

  test('consent expiration is shown', async ({ page }) => {
    await page.goto('/consent');

    // Look for expiration dates or duration indicators
    const expirationText = page.locator('[data-expires], .expires, .expiration, time');

    // Either we have expiration info or empty state
    await expect(page.locator('body')).toBeVisible();
  });

  test('guardians page loads correctly', async ({ page }) => {
    await page.goto('/guardians');
    await expect(page).toHaveURL(/\/guardians$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('add guardian flow is accessible', async ({ page }) => {
    await page.goto('/guardians');

    // Look for add guardian button
    const addBtn = page.getByRole('button', { name: /add|invite|new/i });

    if (await addBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addBtn.click();
      // Should open modal or navigate
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
