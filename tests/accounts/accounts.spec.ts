import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { OverviewPage } from '../../pages/OverviewPage';

test.describe('Parabank — Accounts Overview', () => {
  let loginPage: LoginPage;
  let overviewPage: OverviewPage;

  test.beforeEach(async ({ page }) => {
    loginPage    = new LoginPage(page);
    overviewPage = new OverviewPage(page);
    await loginPage.loginAsDemo();
    await overviewPage.expectOnOverviewPage();
  });

  test('should display the accounts table after login', async () => {
    await expect(overviewPage.accountTable).toBeVisible();
  });

  test('should display at least one account row', async () => {
    const count = await overviewPage.getAccountCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should display account IDs as clickable links', async () => {
    const firstLink = overviewPage.accountRows.first().locator('a').first();
    await expect(firstLink).toBeVisible();
    const href = await firstLink.getAttribute('href');
    expect(href).toContain('activity');
  });

  test('should navigate to account details when clicking an account', async ({ page }) => {
    await overviewPage.clickFirstAccount();
    await expect(page).toHaveURL(/activity/);
    await expect(page.locator('#accountDetails, .ng-scope, table')).toBeVisible({ timeout: 10_000 });
  });

  test('should display total balance row in the table footer', async () => {
    const footer = overviewPage.page.locator('#accountTable tfoot');
    await expect(footer).toBeVisible();
  });

  test('should display balance values containing dollar amounts', async () => {
    const firstRow = overviewPage.accountRows.first();
    const rowText  = await firstRow.textContent();
    expect(rowText).toMatch(/\$[\d,]+\.\d{2}/);
  });

  test('should navigate to Transfer Funds from the left panel', async ({ page }) => {
    await overviewPage.navigateTo('transfer');
    await expect(page).toHaveURL(/transfer/);
    await expect(page.locator('h1.title')).toContainText('Transfer Funds');
  });

  test('should navigate to Bill Pay from the left panel', async ({ page }) => {
    await overviewPage.navigateTo('billpay');
    await expect(page).toHaveURL(/billpay/);
    await expect(page.locator('h1.title')).toContainText('Bill Payment');
  });

  test('should navigate to Open New Account from the left panel', async ({ page }) => {
    await overviewPage.navigateTo('openaccount');
    await expect(page).toHaveURL(/openaccount/);
  });

  test('should navigate to Find Transactions from the left panel', async ({ page }) => {
    await overviewPage.navigateTo('findtrans');
    await expect(page).toHaveURL(/findtrans/);
  });
});
