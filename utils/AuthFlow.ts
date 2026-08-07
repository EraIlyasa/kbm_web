import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { Timeouts } from '../constants/Timeouts.js';

export interface LoginContext {
  page: Page;
  welcomePage: WelcomePage;
  loginPage: LoginPage;
}

/** Logs in via the UI and waits until the redirect to the home page completes. */
export async function loginAs({ page, welcomePage, loginPage }: LoginContext, email: string, password: string): Promise<void> {
  await welcomePage.goto();
  await welcomePage.masukButton.click();
  await loginPage.login(email, password);
  await page.waitForURL((url) => url.pathname === '/', { timeout: Timeouts.NAVIGATION });
  await page.waitForLoadState('load');
}
