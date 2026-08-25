import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import { Timeouts } from '../../constants/Timeouts.js';

test.describe('Forgot Password Specifications', () => {

  // Tag khusus @forgot-password: skenario tunduk pada verifikasi reCAPTCHA yang dapat
  // memblokir pengiriman email. Step hanya sampai submit request reset; pengiriman
  // email TIDAK diverifikasi.
  test('User should be able to submit a password reset request', { tag: ['@smoke', '@regression', '@forgot-password'] }, async ({
    welcomePage,
    loginPage,
    forgotPasswordPage,
    page,
  }) => {
    // Live-site flow: landing -> login -> forgot password -> submit reset request
    test.setTimeout(60000);

    // 1. Open the web
    await welcomePage.goto();

    // 2. Click "Masuk"
    await welcomePage.masukButton.click();
    await page.waitForURL('**/login', { timeout: Timeouts.PAGE_LOAD });
    await page.waitForLoadState('load');

    // 3. Click "Lupa Kata Sandi?"
    await loginPage.openForgotPassword();
    await page.waitForURL('**/forgot-password', { timeout: Timeouts.PAGE_LOAD });

    // 4. Input the email used for login
    const account = Credentials.TEST_ACCOUNTS[0];

    // 5. Verify the reCAPTCHA callback enabled the submit button, then submit.
    //    Step stops here — email delivery is NOT verified (captcha-constrained).
    await expect(forgotPasswordPage.submitButton).toBeEnabled({ timeout: Timeouts.RENDER });
    await forgotPasswordPage.requestReset(account.email);
  });
});
