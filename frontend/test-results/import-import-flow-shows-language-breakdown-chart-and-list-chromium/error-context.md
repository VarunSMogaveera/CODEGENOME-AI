# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: import.spec.ts >> import flow shows language breakdown chart and list
- Location: tests\e2e\import.spec.ts:3:5

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('[aria-label="Language breakdown chart"]') to be visible

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('import flow shows language breakdown chart and list', async ({ page }) => {
  4  |   // Ensure app loads
  5  |   await page.goto('/');
  6  |   await expect(page.locator('text=Analyze any Git repository in seconds')).toBeVisible();
  7  | 
  8  |   // Fill sample repo and submit
  9  |   const sample = 'https://github.com/VarunSMogaveera/Supply-Chain-Tracker';
  10 |   await page.fill('input#repoPath', sample);
  11 |   await page.click('button:has-text("Analyze repository")');
  12 | 
  13 |   // Wait for analysis to complete and for the language breakdown to appear
> 14 |   await page.waitForSelector('[aria-label="Language breakdown chart"]', { timeout: 45000 });
     |              ^ Error: page.waitForSelector: Target page, context or browser has been closed
  15 |   const chart = await page.$('[aria-label="Language breakdown chart"]');
  16 |   expect(chart).not.toBeNull();
  17 | 
  18 |   // Ensure the language list is present and has at least one item
  19 |   const list = await page.$$('[data-testid^="lang-"]');
  20 |   expect(list.length).toBeGreaterThan(0);
  21 | });
  22 | 
```