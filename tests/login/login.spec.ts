import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { OverviewPage } from '../../pages/OverviewPage';

test.describe('Parabank — Login', () => {
  let loginPage: LoginPage;
  let overviewPage: OverviewPage;

  test.beforeEach(async ({ page }) => {
    loginPage    = new LoginPage(page);
    overviewPage = new OverviewPage(page);
    await loginPage.goto();
  });

  test('should display login form elements', async () => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.forgotLoginLink).toBeVisible();
  });

  test('should log in with valid demo credentials', async ({ page }) => {
    await loginPage.login('john', 'demo');
    await expect(page).toHaveURL(/overview/);
    await overviewPage.expectOnOverviewPage();
  });

  test('should show error for invalid username', async () => {
    await loginPage.login('invaliduser123', 'demo');
    await loginPage.expectErrorVisible();
    await loginPage.expectOnLoginPage();
  });

  test('should show error for invalid password', async () => {
    await loginPage.login('john', 'wrongpassword');
    await loginPage.expectErrorVisible();
    await loginPage.expectOnLoginPage();
  });

  test('should show error for empty username', async ({ page }) => {
    await loginPage.login('', 'demo');
    // Stays on login or shows error
    const onLogin = page.url().includes('index') || page.url().includes('login');
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    expect(onLogin || hasError).toBeTruthy();
  });

  test('should show error for empty password', async ({ page }) => {
    await loginPage.login('john', '');
    const onLogin = page.url().includes('index') || page.url().includes('login');
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    expect(onLogin || hasError).toBeTruthy();
  });

  test('should show error for both fields empty', async ({ page }) => {
    await loginPage.loginButton.click();
    const onLogin = page.url().includes('index') || page.url().includes('login');
    const hasError = await loginPage.errorMessage.isVisible().catch(() => false);
    expect(onLogin || hasError).toBeTruthy();
  });

  test('should navigate to register page', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/register/);
  });

  test('should navigate to forgot login page', async ({ page }) => {
    await loginPage.forgotLoginLink.click();
    await expect(page).toHaveURL(/lookup/);
  });

  test('should log out successfully', async ({ page }) => {
    await loginPage.login('john', 'demo');
    await expect(page).toHaveURL(/overview/);
    await overviewPage.logout();
    await expect(page).toHaveURL(/index|logout/);
  });

  test('should not access overview page without logging in', async ({ page }) => {
    await page.goto('/parabank/overview.htm');
    // Should redirect to login or show login panel
    await expect(page.locator('#loginPanel').or(page.locator('input[name="username"]'))).toBeVisible({ timeout: 10_000 });
  });
});
