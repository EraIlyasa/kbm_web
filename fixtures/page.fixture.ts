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
import { BookPage } from '../pages/BookPage.js';
import { TopupPage } from '../pages/TopupPage.js';
import { TransferPage } from '../pages/TransferPage.js';
import { ExchangePage } from '../pages/ExchangePage.js';
import { BookReviewPage } from '../pages/BookReviewPage.js';
import { ChapterCommentPage } from '../pages/ChapterCommentPage.js';
import { CategoryPage } from '../pages/CategoryPage.js';

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
  bookPage: BookPage;
  topupPage: TopupPage;
  transferPage: TransferPage;
  exchangePage: ExchangePage;
  bookReviewPage: BookReviewPage;
  chapterCommentPage: ChapterCommentPage;
  categoryPage: CategoryPage;
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

  // Instantiate BookPage POM via DI
  bookPage: async ({ page }, use) => {
    await use(new BookPage(page));
  },

  // Instantiate TopupPage POM via DI
  topupPage: async ({ page }, use) => {
    await use(new TopupPage(page));
  },

  // Instantiate TransferPage POM via DI
  transferPage: async ({ page }, use) => {
    await use(new TransferPage(page));
  },

  // Instantiate ExchangePage POM via DI
  exchangePage: async ({ page }, use) => {
    await use(new ExchangePage(page));
  },

  // Instantiate BookReviewPage POM via DI
  bookReviewPage: async ({ page }, use) => {
    await use(new BookReviewPage(page));
  },

  // Instantiate ChapterCommentPage POM via DI
  chapterCommentPage: async ({ page }, use) => {
    await use(new ChapterCommentPage(page));
  },

  // Instantiate CategoryPage POM via DI
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
});

export { expect } from '@playwright/test';
