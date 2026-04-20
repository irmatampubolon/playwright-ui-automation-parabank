import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Parabank Transfer Funds Page.
 * URL: https://parabank.parasoft.com/parabank/transfer.htm
 */
export class TransferPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly pageHeading: Locator;

  constructor(page: Page) {
    this.page             = page;
    this.amountInput      = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect  = page.locator('#toAccountId');
    this.transferButton   = page.locator('input[value="Transfer"]');
    this.successMessage   = page.locator('#showResult');
    this.errorMessage     = page.locator('.error');
    this.pageHeading      = page.locator('h1.title');
  }

  async goto() {
    await this.page.goto('/parabank/transfer.htm');
    await this.amountInput.waitFor({ state: 'visible' });
  }

  async transfer(amount: string, fromIndex = 0, toIndex = 1) {
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption({ index: fromIndex });
    await this.toAccountSelect.selectOption({ index: toIndex });
    await this.transferButton.click();
  }

  async expectTransferSuccess() {
    await expect(this.successMessage).toBeVisible({ timeout: 15_000 });
    await expect(this.successMessage).toContainText('Transfer Complete');
  }

  async expectError() {
    await expect(this.errorMessage).toBeVisible();
  }
}
