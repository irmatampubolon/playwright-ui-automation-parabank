import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Parabank Login Page.
 * URL: https://parabank.parasoft.com/parabank/index.htm
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;
  readonly forgotLoginLink: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.usernameInput  = page.locator('input[name="username"]');
    this.passwordInput  = page.locator('input[name="password"]');
    this.loginButton    = page.locator('input[value="Log In"]');
    this.errorMessage   = page.locator('.error');
    this.registerLink   = page.locator('a[href*="register"]');
    this.forgotLoginLink = page.locator('a[href*="lookup"]');
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAsDemo() {
    await this.goto();
    await this.login('john', 'demo');
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL(/index\.htm/);
    await expect(this.usernameInput).toBeVisible();
  }
}
