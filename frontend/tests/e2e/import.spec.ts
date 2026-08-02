import { test, expect } from '@playwright/test';

test('import flow shows language breakdown chart and list', async ({ page }) => {
  // Ensure app loads
  await page.goto('/');
  await expect(page).toHaveTitle(/Analyze any Git repository/i);

  // Fill sample repo and submit
  const sample = 'https://github.com/VarunSMogaveera/Supply-Chain-Tracker';
  await page.fill('input#repoPath', sample);
  await page.click('button:has-text("Analyze repository")');

  // Wait for analysis to complete and for the language breakdown to appear
  await page.waitForSelector('[aria-label="Language breakdown chart"]', { timeout: 45000 });
  const chart = await page.$('[aria-label="Language breakdown chart"]');
  expect(chart).not.toBeNull();

  // Ensure the language list is present and has at least one item
  const list = await page.$$('[data-testid^="lang-"]');
  expect(list.length).toBeGreaterThan(0);
});
