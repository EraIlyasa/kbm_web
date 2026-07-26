import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { SettingsPage } from '../pages/SettingsPage.js';
import { TimelinePage } from '../pages/TimelinePage.js';
import { ProfilePage } from '../pages/ProfilePage.js';
import { WritingPage } from '../pages/WritingPage.js';
import { AuthApi } from '../api/AuthApi.js';
import { URLs } from '../constants/URLs.js';

// Extend base Playwright test type to include custom fixtures
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  welcomePage: WelcomePage;
  settingsPage: SettingsPage;
  timelinePage: TimelinePage;
  profilePage: ProfilePage;
  writingPage: WritingPage;
  authApi: AuthApi;
};

export const test = base.extend<CustomFixtures>({
  // Configure page fixture
  page: async ({ page }, use) => {
    try {
      // Query physical screen size dynamically
      const screenSize = await page.evaluate(() => {
        return {
          width: window.screen.availWidth || window.screen.width || 1280,
          height: window.screen.availHeight || window.screen.height || 720
        };
      });
      // Set viewport to the monitor resolution
      await page.setViewportSize(screenSize);
    } catch (e) {
      console.warn('Could not dynamically resize viewport:', e);
    }

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

  // Instantiate AuthApi client via DI
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
});

export { expect } from '@playwright/test';
