import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { Credentials } from '../constants/Credentials.js';
import { Timeouts } from '../constants/Timeouts.js';

export interface LoginContext {
  page: Page;
  welcomePage: WelcomePage;
  loginPage: LoginPage;
}

export interface TestAccount {
  email: string;
  password: string;
}

/**
 * Resolves the test account used for login.
 *
 * By default it rotates across `Credentials.TEST_ACCOUNTS` using `workerIndex`
 * so parallel workers don't share an account. To force a specific account
 * without touching code, set `TEST_ACCOUNT_INDEX` in `.env` (0-based).
 */
export function getTestAccount(workerIndex = 0): TestAccount {
  const override = process.env.TEST_ACCOUNT_INDEX;
  const parsed = override === undefined || override === '' ? NaN : Number(override);
  const index = Number.isNaN(parsed) ? workerIndex : parsed;
  return Credentials.TEST_ACCOUNTS[index % Credentials.TEST_ACCOUNTS.length];
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

/**
 * Logs in with retry using the account resolved by `getTestAccount`. Convenience
 * wrapper so specs don't repeat account selection logic.
 */
export async function loginAsTestUser(context: LoginContext, workerIndex = 0): Promise<void> {
  const account = getTestAccount(workerIndex);
  await loginAsWithRetry(context, account.email, account.password);
}
