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

/** Logs in with retry to tolerate intermittent reCAPTCHA v3 rate-limiting on the login form. */
export async function loginAsWithRetry(context: LoginContext, email: string, password: string, attempts = 2): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await loginAs(context, email, password);
      return;
    } catch (error) {
      lastError = error;
      await context.page.waitForTimeout(Timeouts.PROCESSING);
    }
  }

  throw lastError;
}
