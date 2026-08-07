import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { TimelinePage } from '../pages/TimelinePage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { WritingPage } from '../pages/WritingPage.js';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage.js';
import { RegisterPage } from '../pages/RegisterPage.js';

// Extend base Playwright test type to include custom fixtures
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  welcomePage: WelcomePage;
  settingsPage: SettingsPage;
  timelinePage: TimelinePage;
  profilePage: ProfilePage;
  writingPage: WritingPage;
  forgotPasswordPage: ForgotPasswordPage;
  registerPage: RegisterPage;
};

export const test = base.extend<CustomFixtures>({
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

  // Instantiate TimelinePage POM via DI
  timelinePage: async ({ page }, use) => {
    await use(new TimelinePage(page));
  },

  // Instantiate ProfilePage POM via DI
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },

  // Instantiate WritingPage POM via DI
  writingPage: async ({ page }, use) => {
    await use(new WritingPage(page));
  },

  // Instantiate ForgotPasswordPage POM via DI
  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  // Instantiate RegisterPage POM via DI
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
});

export { expect } from '@playwright/test';
