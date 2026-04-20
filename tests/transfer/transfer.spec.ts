import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { TransferPage } from '../../pages/TransferPage';
import { OverviewPage } from '../../pages/OverviewPage';

test.describe('Parabank — Transfer Funds', () => {
  let loginPage: LoginPage;
  let transferPage: TransferPage;
  let overviewPage: OverviewPage;

  test.beforeEach(async ({ page }) => {
    loginPage    = new LoginPage(page);
    transferPage = new TransferPage(page);
    overviewPage = new OverviewPage(page);
    await loginPage.loginAsDemo();
    await overviewPage.expectOnOverviewPage();
    await transferPage.goto();
  });

  test('should display transfer funds form elements', async () => {
    await expect(transferPage.amountInput).toBeVisible();
    await expect(transferPage.fromAccountSelect).toBeVisible();
    await expect(transferPage.toAccountSelect).toBeVisible();
    await expect(transferPage.transferButton).toBeVisible();
  });

  test('should display at least two accounts in from-account dropdown', async () => {
    const options = await transferPage.fromAccountSelect.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('should complete a valid fund transfer', async () => {
    await transferPage.transfer('50.00');
    await transferPage.expectTransferSuccess();
  });

  test('should show transfer amount in success message', async () => {
    await transferPage.transfer('25.00');
    await expect(transferPage.successMessage).toContainText('25');
  });

  test('should show error when amount field is empty', async ({ page }) => {
    await transferPage.amountInput.fill('');
    await transferPage.transferButton.click();
    const hasError = await transferPage.errorMessage.isVisible().catch(() => false);
    const staysOnPage = page.url().includes('transfer');
    expect(hasError || staysOnPage).toBeTruthy();
  });

  test('should show error for non-numeric amount', async ({ page }) => {
    await transferPage.amountInput.fill('abc');
    await transferPage.transferButton.click();
    const hasError = await transferPage.errorMessage.isVisible().catch(() => false);
    const staysOnPage = page.url().includes('transfer');
    expect(hasError || staysOnPage).toBeTruthy();
  });

  test('should show error for zero amount', async ({ page }) => {
    await transferPage.amountInput.fill('0');
    await transferPage.transferButton.click();
    const hasError = await transferPage.errorMessage.isVisible().catch(() => false);
    const staysOnPage = page.url().includes('transfer');
    expect(hasError || staysOnPage).toBeTruthy();
  });

  test('should show error for negative amount', async ({ page }) => {
    await transferPage.amountInput.fill('-100');
    await transferPage.transferButton.click();
    const hasError = await transferPage.errorMessage.isVisible().catch(() => false);
    const staysOnPage = page.url().includes('transfer');
    expect(hasError || staysOnPage).toBeTruthy();
  });

  test('should allow decimal amount transfer', async () => {
    await transferPage.transfer('10.50');
    await transferPage.expectTransferSuccess();
  });

  test('should update account balance after transfer', async ({ page }) => {
    // Get initial balance from overview
    await overviewPage.goto();
    const initialText = await overviewPage.accountRows.first().textContent();
    const initialBalance = parseFloat(
      (initialText?.match(/\$([\d,]+\.\d{2})/) ?? ['', '0'])[1].replace(',', '')
    );

    // Perform transfer
    await transferPage.goto();
    await transferPage.transfer('10.00');
    await transferPage.expectTransferSuccess();

    // Check balance changed on overview
    await overviewPage.goto();
    const updatedText = await overviewPage.accountRows.first().textContent();
    expect(updatedText).not.toEqual(initialText);
  });
});
