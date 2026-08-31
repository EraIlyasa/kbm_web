import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { loginAs } from '../utils/AuthFlow.js';
import { Credentials } from '../constants/Credentials.js';
import * as path from 'path';
import * as fs from 'fs';

const authDir = path.resolve(__dirname, '../playwright/.auth');
const authFile = path.resolve(authDir, 'user.json');

setup('authenticate', async ({ page }) => {
  // Ensure .auth directory exists
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Check if existing session state is still valid
  if (fs.existsSync(authFile)) {
    try {
      await page.goto('/');
      await page.waitForLoadState('load');
      if (!page.url().includes('/login')) {
        console.log(`[Global Auth Setup] Reusing active session state from ${authFile}`);
        return;
      }
      console.log('[Global Auth Setup] Session expired, re-authenticating...');
    } catch {
      // If check fails, re-authenticate below
    }
  }

  const welcomePage = new WelcomePage(page);
  const loginPage = new LoginPage(page);

  const account = Credentials.TEST_ACCOUNTS[0];
  console.log(`[Global Auth Setup] Authenticating once for ${account.email}...`);

  await welcomePage.goto();
  await welcomePage.masukButton.click();
  await loginPage.login(account.email, account.password);

  try {
    await page.waitForURL((url) => url.pathname === '/', { timeout: 7000 });
  } catch {
    console.log('[Global Auth Setup] Reloading page to settle session in Chrome...');
    await page.reload({ waitUntil: 'load' });
    if (page.url().includes('/login')) {
      await page.goto('/');
    }
  }

  // Save the authenticated storage state to disk
  await page.context().storageState({ path: authFile });
  console.log(`[Global Auth Setup] Saved session state to ${authFile}`);
});
