import { Page } from '@playwright/test';

/**
 * Log in and return the page, ready for further actions.
 * Reusable across test files to avoid repeating login steps.
 */
export async function loginAsDemo(page: Page) {
  await page.goto('/parabank/index.htm');
  await page.locator('input[name="username"]').fill('john');
  await page.locator('input[name="password"]').fill('demo');
  await page.locator('input[value="Log In"]').click();
  await page.waitForURL(/overview/);
}

/**
 * Extract a dollar amount from a string like "$1,250.00" → 1250.00
 */
export function parseDollarAmount(text: string): number {
  const match = text.match(/\$([\d,]+\.\d{2})/);
  if (!match) return 0;
  return parseFloat(match[1].replace(',', ''));
}

/**
 * Wait for the page to fully settle after navigation.
 */
export async function waitForPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
}
