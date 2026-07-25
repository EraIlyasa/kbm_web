import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { AuthApi } from '../api/AuthApi.js';
import { URLs } from '../constants/URLs.js';

// Extend base Playwright test type to include custom fixtures
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  welcomePage: WelcomePage;
  settingsPage: SettingsPage;
  authApi: AuthApi;
};

export const test = base.extend<CustomFixtures>({
  // Configure page fixture
  page: async ({ page }, use) => {
    // Run the test with the prepared page context
    await use(page);
  },

  // Instantiate LoginPage POM via DI
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Instantiate DashboardPage POM via DI
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Instantiate WelcomePage POM via DI
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },

  // Instantiate SettingsPage POM via DI
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },

  // Instantiate AuthApi client via DI
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
});

export { expect } from '@playwright/test';
