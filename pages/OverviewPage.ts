import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Parabank Accounts Overview Page.
 * URL: https://parabank.parasoft.com/parabank/overview.htm
 */
export class OverviewPage {
  readonly page: Page;
  readonly pageHeading: Locator;
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalance: Locator;
  readonly logoutLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly openAccountLink: Locator;
  readonly findTransactionsLink: Locator;

  constructor(page: Page) {
    this.page                = page;
    this.pageHeading         = page.locator('h1.title');
    this.accountTable        = page.locator('#accountTable');
    this.accountRows         = page.locator('#accountTable tbody tr');
    this.totalBalance        = page.locator('#accountTable tfoot td').last();
    this.logoutLink          = page.locator('a[href*="logout"]');
    this.transferFundsLink   = page.locator('a[href*="transfer"]');
    this.billPayLink         = page.locator('a[href*="billpay"]');
    this.openAccountLink     = page.locator('a[href*="openaccount"]');
    this.findTransactionsLink = page.locator('a[href*="findtrans"]');
  }

  async goto() {
    await this.page.goto('/parabank/overview.htm');
    await this.accountTable.waitFor({ state: 'visible' });
  }

  async getAccountCount(): Promise<number> {
    return await this.accountRows.count();
  }

  async getFirstAccountId(): Promise<string> {
    const firstLink = this.accountRows.first().locator('a').first();
    return (await firstLink.textContent())?.trim() ?? '';
  }

  async clickFirstAccount() {
    await this.accountRows.first().locator('a').first().click();
  }

  async navigateTo(section: 'transfer' | 'billpay' | 'openaccount' | 'findtrans') {
    const map = {
      transfer:    this.transferFundsLink,
      billpay:     this.billPayLink,
      openaccount: this.openAccountLink,
      findtrans:   this.findTransactionsLink,
    };
    await map[section].click();
  }

  async logout() {
    await this.logoutLink.click();
  }

  async expectOnOverviewPage() {
    await expect(this.page).toHaveURL(/overview/);
    await expect(this.accountTable).toBeVisible();
  }
}
