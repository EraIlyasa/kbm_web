import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { ReturnAllApi } from '../../api/ReturnAllApi.js';
import registerData from '../../data/register-account.json';
import type { Page } from '@playwright/test';
import type { WelcomePage } from '../../pages/WelcomePage.js';
import type { LoginPage } from '../../pages/LoginPage.js';
import type { RegisterPage } from '../../pages/RegisterPage.js';

interface RegisterContext {
  page: Page;
  welcomePage: WelcomePage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
}

async function attemptRegister(
  { page, welcomePage, loginPage, registerPage }: RegisterContext,
  email: string,
  password: string,
): Promise<boolean> {
  await welcomePage.goto();
  await welcomePage.masukButton.click();
  await loginPage.registerLink.click();
  await page.waitForURL('**/register', { timeout: Timeouts.PAGE_LOAD });
  await registerPage.fillRegisterForm(email, password);
  await registerPage.submit();
  return registerPage.successMessage
    .waitFor({ state: 'visible', timeout: Timeouts.RENDER })
    .then(() => true)
    .catch(() => false);
}

test.describe('User registration', { tag: ['@register', '@regression'] }, () => {
  test.beforeAll(async ({ request }) => {
    const returnAllApi = new ReturnAllApi(request);
    const resetResponse = await returnAllApi.resetRegisteredEmail();
    expect(resetResponse.ok()).toBeTruthy();
  });

  for (let i = 0; i < registerData.length; i++) {
    const account = registerData[i];
    test(`User should register form and fill the account data ${i + 1}`, { tag: ['@register', '@regression'] }, async ({
      welcomePage,
      loginPage,
      registerPage,
      page,
    }) => {
      const context: RegisterContext = { page, welcomePage, loginPage, registerPage };

      const success = await attemptRegister(context, account.email, account.password);
      if (!success) {
        await page.waitForTimeout(Timeouts.PROCESSING);
        const retried = await attemptRegister(context, account.email, account.password);
        expect(retried).toBeTruthy();
      }

      await expect(registerPage.successMessage).toContainText('Email sudah terkirim', { timeout: Timeouts.RENDER });
    });
  }

  test.afterEach(async () => {
    // Wait between tests to avoid reCAPTCHA v3 rate-limiting
    await new Promise(resolve => setTimeout(resolve, 10000));
  });
});
