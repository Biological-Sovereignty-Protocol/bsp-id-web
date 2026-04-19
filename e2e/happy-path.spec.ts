import { test, expect } from '@playwright/test';

test.describe('BSP ID Web — happy path', () => {
  test('home page loads and shows Create CTA', async ({ page }) => {
    await page.goto('/');
    // The landing page has a Link wrapping the Create CTA pointing to /create
    const createLink = page.locator('a[href="/create"]').first();
    await expect(createLink).toBeVisible();
  });

  test('navigation between pages works (dashboard, consent, guardians)', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/consent');
    await expect(page).toHaveURL(/\/consent$/);
    await expect(page.locator('body')).toBeVisible();

    await page.goto('/guardians');
    await expect(page).toHaveURL(/\/guardians$/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('language switcher cycles EN / PT / ES', async ({ page }) => {
    await page.goto('/');

    // Language switcher is usually a button exposing the current language code.
    // We try to find a control that contains EN/PT/ES text.
    const langButton = page
      .getByRole('button', { name: /^(EN|PT|ES)$/i })
      .first();

    await expect(langButton).toBeVisible();

    const initial = (await langButton.textContent())?.trim().toUpperCase() ?? '';
    expect(['EN', 'PT', 'ES']).toContain(initial);

    // Click and confirm the language label changes.
    await langButton.click();
    await page.waitForTimeout(300);
    const afterFirst = (await langButton.textContent())?.trim().toUpperCase() ?? '';
    expect(['EN', 'PT', 'ES']).toContain(afterFirst);
    expect(afterFirst).not.toBe(initial);

    // Cycle once more to ensure the switcher keeps rotating.
    await langButton.click();
    await page.waitForTimeout(300);
    const afterSecond = (await langButton.textContent())?.trim().toUpperCase() ?? '';
    expect(['EN', 'PT', 'ES']).toContain(afterSecond);
  });
});
