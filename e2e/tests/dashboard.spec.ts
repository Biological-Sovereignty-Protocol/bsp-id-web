import { test, expect } from '@playwright/test';

test.describe('User Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Create a mock identity in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      const mockIdentity = {
        domain: 'testuser.bsp',
        publicKeyHex: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        privateKeyHex: 'f1e2d3c4b5a6789012345678901234567890fedcba0987654321fedcba098765',
        beoId: 'beo_test_001',
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('bsp_identity', JSON.stringify(mockIdentity));
    });
  });

  test('should display user dashboard when authenticated', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify dashboard loads
    await expect(page).toHaveURL(/\/dashboard$/);

    // Should show user domain in sidebar or header
    const domainDisplay = page.locator('text=/testuser.bsp/i').first();
    await expect(domainDisplay).toBeVisible();

    // Dashboard should show stats cards
    const statsSection = page.locator('[class*="grid"]').first();
    await expect(statsSection).toBeVisible();
  });

  test('should display stats cards (consents, biorecords, guardians)', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Check for stat labels
    const consentCard = page.locator('text=/consent|consentimento/i').first();
    const biorecordsCard = page.locator('text=/biorecord|registro/i').first();
    const guardiansCard = page.locator('text=/guardian|guardiao/i').first();

    // At least one stat card should be visible
    const consentVisible = await consentCard.isVisible().catch(() => false);
    const biorecordsVisible = await biorecordsCard.isVisible().catch(() => false);
    const guardiansVisible = await guardiansCard.isVisible().catch(() => false);

    expect(consentVisible || biorecordsVisible || guardiansVisible).toBeTruthy();
  });

  test('should list biorecords', async ({ page }) => {
    await page.goto('/biorecords');

    // Verify biorecords page loads
    await expect(page).toHaveURL(/\/biorecords$/);

    // Page should have biorecords title
    const biorecordsHeader = page.locator('h1').filter({ hasText: /biorecord|registro/i });
    await expect(biorecordsHeader).toBeVisible();

    // Demo mode should show sample records
    await page.waitForTimeout(500);

    // Check for BSP category codes (indicating records are displayed)
    const categoryCode = page.locator('text=/BSP-/').first();
    const hasRecords = await categoryCode.isVisible().catch(() => false);

    // Or check for record names
    const recordName = page.locator('text=/hemoglobin|glucose|tsh/i').first();
    const hasRecordNames = await recordName.isVisible().catch(() => false);

    expect(hasRecords || hasRecordNames).toBeTruthy();
  });

  test('should navigate to record details (view transaction)', async ({ page }) => {
    await page.goto('/biorecords');
    await page.waitForTimeout(500);

    // Find a record with transaction link
    const txLink = page.locator('a[href*="explorer.aptoslabs.com"]').first();

    if (await txLink.isVisible()) {
      // Verify the link has correct format
      const href = await txLink.getAttribute('href');
      expect(href).toMatch(/explorer\.aptoslabs\.com\/txn/);
    } else {
      // Alternative: look for "View on Aptos" text
      const viewTxText = page.locator('text=/view.*aptos|ver.*tx/i').first();
      const hasViewLink = await viewTxText.isVisible().catch(() => false);
      expect(hasViewLink).toBeTruthy();
    }
  });

  test('should display sidebar navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Sidebar should have navigation items
    const overviewLink = page.locator('a[href="/dashboard"]').first();
    const consentsLink = page.locator('a[href="/consent"]').first();
    const biorecordsLink = page.locator('a[href="/biorecords"]').first();
    const guardiansLink = page.locator('a[href="/guardians"]').first();

    // Check visibility (sidebar might be hidden on mobile)
    const overviewVisible = await overviewLink.isVisible().catch(() => false);
    const consentsVisible = await consentsLink.isVisible().catch(() => false);

    // At least dashboard link should be accessible
    expect(overviewVisible || consentsVisible).toBeTruthy();
  });

  test('should display quick actions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Quick actions section should have links to consent and guardians
    const consentAction = page.locator('a[href="/consent"]').first();
    const guardiansAction = page.locator('a[href="/guardians"]').first();

    const consentVisible = await consentAction.isVisible().catch(() => false);
    const guardiansVisible = await guardiansAction.isVisible().catch(() => false);

    expect(consentVisible || guardiansVisible).toBeTruthy();
  });

  test('should display identity details section', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Should show domain label and value
    const domainLabel = page.locator('text=/domain|dominio/i').first();
    const publicKeyLabel = page.locator('text=/public.*key|chave.*publica/i').first();
    const statusLabel = page.locator('text=/status/i').first();

    const hasDomain = await domainLabel.isVisible().catch(() => false);
    const hasKey = await publicKeyLabel.isVisible().catch(() => false);
    const hasStatus = await statusLabel.isVisible().catch(() => false);

    expect(hasDomain || hasKey || hasStatus).toBeTruthy();
  });

  test('should display audit log', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Audit log section should show recent activity
    const auditSection = page.locator('text=/audit.*log|historico/i').first();
    const hasAuditSection = await auditSection.isVisible().catch(() => false);

    // Or check for specific audit entry types
    const auditEntry = page.locator('text=/consent.*granted|beo.*created|record.*received/i').first();
    const hasAuditEntry = await auditEntry.isVisible().catch(() => false);

    expect(hasAuditSection || hasAuditEntry).toBeTruthy();
  });

  test('should display security score', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Security score section
    const securitySection = page.locator('text=/security.*score|pontuacao/i').first();
    const hasSecuritySection = await securitySection.isVisible().catch(() => false);

    // Or percentage indicator
    const percentage = page.locator('text=/\\d+%/').first();
    const hasPercentage = await percentage.isVisible().catch(() => false);

    expect(hasSecuritySection || hasPercentage).toBeTruthy();
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    // Clear identity
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Try to access dashboard
    await page.goto('/dashboard');
    await page.waitForTimeout(500);

    // Should show login/access form or redirect
    const createLink = page.locator('a[href="/create"]');
    const recoverLink = page.locator('a[href="/recover"]');
    const seedInput = page.locator('textarea');

    const hasCreateLink = await createLink.isVisible().catch(() => false);
    const hasRecoverLink = await recoverLink.isVisible().catch(() => false);
    const hasSeedInput = await seedInput.isVisible().catch(() => false);

    // Should show unauthenticated state
    expect(hasCreateLink || hasRecoverLink || hasSeedInput).toBeTruthy();
  });
});
