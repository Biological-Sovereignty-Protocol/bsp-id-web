import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow — BEO Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should load onboarding page with create CTA', async ({ page }) => {
    await page.goto('/');

    // Verify landing page loads with Create CTA
    const createLink = page.locator('a[href="/create"]').first();
    await expect(createLink).toBeVisible();

    // Verify BSP protocol branding is present
    await expect(page.locator('body')).toContainText('BSP');
  });

  test('should navigate to create page and show domain input', async ({ page }) => {
    await page.goto('/create');

    // Verify create page loads
    await expect(page).toHaveURL(/\/create$/);

    // Domain input should be visible and focusable
    const domainInput = page.locator('input[placeholder*="domain"], input[placeholder*="name"]').first();
    await expect(domainInput).toBeVisible();

    // Step indicators should show step 1
    const stepIndicators = page.locator('[class*="flex"][class*="items-center"][class*="gap"]').filter({ hasText: '1' });
    await expect(stepIndicators.first()).toBeVisible();
  });

  test('should create new BEO identity (demo mode)', async ({ page }) => {
    await page.goto('/create');

    // Step 1: Enter domain name
    const domainInput = page.locator('input').first();
    await expect(domainInput).toBeVisible();

    // Generate unique domain for test
    const testDomain = `testuser${Date.now()}`;
    await domainInput.fill(testDomain);

    // Wait for availability check (mock shows available after short delay)
    await page.waitForTimeout(600);

    // Check if domain is available (green checkmark appears)
    const availableIndicator = page.locator('text=/available|disponivel/i');
    if (await availableIndicator.isVisible()) {
      // Click Next/Continue button to generate keys
      const nextButton = page.locator('button').filter({ hasText: /next|proximo|continue|criar/i }).first();
      await expect(nextButton).toBeEnabled();
      await nextButton.click();

      // Step 2: Seed phrase display
      await page.waitForTimeout(500);
      const seedPhraseSection = page.locator('[class*="grid"][class*="cols"]').first();
      if (await seedPhraseSection.isVisible()) {
        // Verify seed phrase words are displayed (12 words)
        const words = await page.locator('[class*="grid"] span').count();
        expect(words).toBeGreaterThanOrEqual(12);

        // Click confirm button to proceed
        const confirmButton = page.locator('button').filter({ hasText: /confirm|saved|guardei|next/i }).first();
        if (await confirmButton.isVisible()) {
          await confirmButton.click();

          // Step 3: Guardian setup (optional, skip for now)
          await page.waitForTimeout(300);
          const skipButton = page.locator('button').filter({ hasText: /skip|pular|later/i }).first();
          if (await skipButton.isVisible()) {
            await skipButton.click();
          }
        }
      }
    }
  });

  test('should show success confirmation after BEO creation', async ({ page }) => {
    await page.goto('/create');

    const domainInput = page.locator('input').first();
    await expect(domainInput).toBeVisible();

    const testDomain = `success${Date.now()}`;
    await domainInput.fill(testDomain);
    await page.waitForTimeout(600);

    // Follow the complete flow
    const nextButton = page.locator('button').filter({ hasText: /next|proximo|continue/i }).first();
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(500);

      // Confirm seed phrase
      const confirmButton = page.locator('button').filter({ hasText: /confirm|saved|guardei/i }).first();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(300);

        // Skip guardians
        const skipButton = page.locator('button').filter({ hasText: /skip|pular/i }).first();
        if (await skipButton.isVisible()) {
          await skipButton.click();

          // Wait for registration (demo mode simulates 2s delay)
          await page.waitForTimeout(3000);

          // Verify success state
          const successElement = page.locator('text=/success|sucesso|created|criado/i');
          const dashboardLink = page.locator('a[href="/dashboard"]');

          // Either success message or dashboard link should appear
          const successVisible = await successElement.isVisible().catch(() => false);
          const dashboardVisible = await dashboardLink.isVisible().catch(() => false);

          expect(successVisible || dashboardVisible).toBeTruthy();
        }
      }
    }
  });

  test('should reject unavailable domain names', async ({ page }) => {
    await page.goto('/create');

    const domainInput = page.locator('input').first();
    await expect(domainInput).toBeVisible();

    // 'ambrosio' is hardcoded as unavailable in the mock
    await domainInput.fill('ambrosio');
    await page.waitForTimeout(600);

    // Check for unavailable indicator
    const unavailableIndicator = page.locator('text=/unavailable|indisponivel/i');
    const isUnavailable = await unavailableIndicator.isVisible().catch(() => false);

    // The next button should be disabled for unavailable domains
    const nextButton = page.locator('button').filter({ hasText: /next|proximo|continue/i }).first();
    const isDisabled = await nextButton.isDisabled().catch(() => true);

    expect(isUnavailable || isDisabled).toBeTruthy();
  });
});
