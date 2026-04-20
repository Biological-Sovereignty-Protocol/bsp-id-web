import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility smoke tests using @axe-core/playwright.
 * Checks WCAG 2.1 A/AA rules on critical public routes.
 * Non-critical routes (dashboard, consent, etc.) require an authenticated
 * BEO identity and are covered by the dedicated happy-path specs.
 */
const publicRoutes = [
  { name: "landing", path: "/" },
  { name: "create", path: "/create" },
  { name: "recover", path: "/recover" },
  { name: "institution", path: "/institution" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
];

for (const route of publicRoutes) {
  test(`a11y — ${route.name} has no critical violations`, async ({ page }) => {
    await page.goto(route.path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const critical = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? "")
    );

    if (critical.length > 0) {
      console.log(`[a11y] ${route.name} violations:`, JSON.stringify(critical, null, 2));
    }

    expect(critical).toEqual([]);
  });
}

test("layout — skip-to-content link exists", async ({ page }) => {
  await page.goto("/");
  const skip = page.getByRole("link", { name: /skip to content/i });
  await expect(skip).toBeAttached();
});

test("layout — main landmark has id=main", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main#main")).toBeVisible();
});
