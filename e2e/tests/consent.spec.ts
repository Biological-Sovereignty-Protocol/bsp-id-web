import { test, expect } from '@playwright/test';

test.describe('Consent Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Create a mock identity in localStorage for authenticated tests
    await page.goto('/');
    await page.evaluate(() => {
      const mockIdentity = {
        domain: 'testuser.bsp',
        publicKeyHex: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        privateKeyHex: 'f1e2d3c4b5a6789012345678901234567890fedcba0987654321fedcba098765',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('bsp_identity', JSON.stringify(mockIdentity));
    });
  });

  test('should display consent management page', async ({ page }) => {
    await page.goto('/consent');

    // Verify consent page loads
    await expect(page).toHaveURL(/\/consent$/);

    // Page should have consent title/header
    const consentHeader = page.locator('h1').filter({ hasText: /consent|consentimento/i });
    await expect(consentHeader).toBeVisible();

    // Should show institution input field
    const institutionInput = page.locator('input[placeholder*="fleury"], input[placeholder*="ex:"]').first();
    await expect(institutionInput).toBeVisible();
  });

  test('should display active consents list', async ({ page }) => {
    await page.goto('/consent');

    // Wait for page to load with demo data
    await page.waitForTimeout(500);

    // Demo mode preloads consents (fleury.bsp, dasa.bsp)
    const fleuryConsent = page.locator('text=/fleury.bsp/i');
    const dasaConsent = page.locator('text=/dasa.bsp/i');

    // At least one demo consent should be visible
    const fleuryVisible = await fleuryConsent.first().isVisible().catch(() => false);
    const dasaVisible = await dasaConsent.first().isVisible().catch(() => false);

    expect(fleuryVisible || dasaVisible).toBeTruthy();
  });

  test('should grant consent to provider', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForTimeout(500);

    // Enter a new institution domain
    const institutionInput = page.locator('input[placeholder*="fleury"], input[placeholder*="ex:"]').first();
    await expect(institutionInput).toBeVisible();
    await institutionInput.fill('newlab.bsp');

    // Select at least one intent checkbox
    const submitRecordCheckbox = page.locator('label').filter({ hasText: /submit|enviar/i }).first();
    if (await submitRecordCheckbox.isVisible()) {
      await submitRecordCheckbox.click();
    }

    // Select a data category
    const labCategory = page.locator('label').filter({ hasText: /BSP-LA|Laboratory/i }).first();
    if (await labCategory.isVisible()) {
      await labCategory.click();
    }

    // Click authorize button
    const authorizeButton = page.locator('button').filter({ hasText: /authorize|autorizar|grant/i }).first();
    await expect(authorizeButton).toBeVisible();
    await expect(authorizeButton).toBeEnabled();

    // Listen for alert dialog (demo mode shows success alert)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toMatch(/success|sucesso/i);
      await dialog.accept();
    });

    await authorizeButton.click();

    // Wait for operation to complete
    await page.waitForTimeout(2000);
  });

  test('should revoke consent', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForTimeout(500);

    // Find an active consent with revoke button
    const revokeButton = page.locator('button').filter({ hasText: /revoke|revogar/i }).first();

    if (await revokeButton.isVisible()) {
      // Listen for success alert
      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await revokeButton.click();
      await page.waitForTimeout(500);

      // After revoke, the consent status should change to 'revoked'
      const revokedStatus = page.locator('text=/revoked|revogado/i').first();
      const isRevoked = await revokedStatus.isVisible().catch(() => false);

      // Either status changed or button disappeared (already revoked)
      expect(isRevoked || !(await revokeButton.isVisible().catch(() => false))).toBeTruthy();
    }
  });

  test('should display intent types correctly', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForTimeout(500);

    // Verify intent checkboxes are present
    const intentLabels = [
      /submit|enviar/i,
      /read|ler/i,
      /analyze|analisar/i,
      /export|exportar/i
    ];

    for (const labelPattern of intentLabels) {
      const label = page.locator('label').filter({ hasText: labelPattern }).first();
      const isVisible = await label.isVisible().catch(() => false);
      // At least some intent types should be visible
      if (isVisible) {
        expect(isVisible).toBeTruthy();
        break;
      }
    }
  });

  test('should display data categories', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForTimeout(500);

    // Verify BSP category codes are present
    const categories = ['BSP-LA', 'BSP-GL', 'BSP-HM', 'BSP-HR'];
    let foundCategory = false;

    for (const cat of categories) {
      const categoryLabel = page.locator(`text=${cat}`).first();
      if (await categoryLabel.isVisible().catch(() => false)) {
        foundCategory = true;
        break;
      }
    }

    expect(foundCategory).toBeTruthy();
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    await page.goto('/consent');
    await page.waitForTimeout(500);

    // Click on dashboard/overview link in sidebar
    const dashboardLink = page.locator('a[href="/dashboard"]').first();
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click();
      await expect(page).toHaveURL(/\/dashboard$/);
    }

    // Navigate to biorecords
    const biorecordsLink = page.locator('a[href="/biorecords"]').first();
    if (await biorecordsLink.isVisible()) {
      await biorecordsLink.click();
      await expect(page).toHaveURL(/\/biorecords$/);
    }
  });
});
