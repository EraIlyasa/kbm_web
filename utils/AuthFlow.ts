import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { Credentials } from '../constants/Credentials.js';
import { Timeouts } from '../constants/Timeouts.js';
import { URLs } from '../constants/URLs.js';

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
 * Smart authentication helper:
 * 1. Checks if the session is already active (via storageState).
 * 2. If logged in, navigates directly home (0 captcha, ~200ms).
 * 3. If not logged in / session expired, falls back to UI login with retry.
 */
export async function loginAsTestUser(context: LoginContext, workerIndex = 0): Promise<void> {
  try {
    await context.page.goto('/');
    await context.page.waitForLoadState('load');
    if (!context.page.url().includes('/login')) {
      return;
    }
  } catch {
    // If initial check fails, continue to UI login below
  }

  const account = getTestAccount(workerIndex);
  await loginAsWithRetry(context, account.email, account.password);
}

/**
 * Performs fast, reliable authentication via API request, bypassing UI reCAPTCHA entirely.
 * Automatically synchronizes session cookies into the page context.
 */
export async function loginViaApi(page: Page, email: string, password: string): Promise<void> {
  const response = await page.request.post(URLs.API.AUTH_LOGIN, {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(`API Login failed for ${email} with status ${response.status()}`);
  }

  await page.goto('/');
  await page.waitForLoadState('load');
}

/**
 * Fast API-based login convenience wrapper using test account resolution.
 */
export async function loginAsTestUserApi(page: Page, workerIndex = 0): Promise<void> {
  const account = getTestAccount(workerIndex);
  await loginViaApi(page, account.email, account.password);
}

