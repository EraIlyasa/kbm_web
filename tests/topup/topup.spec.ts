import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';

const PACKAGE_NAME = '150 Koin Emas';
const PAYMENT_METHOD = 'ID_DANA';
const SUCCESS_MESSAGE = 'Yeayy, sekarang waktunya kamu untuk nikmati keseruan berbagai cerita di KBM.';

test.describe('Topup Specifications', () => {
  test('User should topup 150 gold coins via Dana e-wallet', { tag: ['@topup', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    topupPage,
    page,
  }, testInfo) => {
    test.setTimeout(180000);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAsTestUser({ page, welcomePage, loginPage }, testInfo.workerIndex);
    });

    await test.step('Open the topup package page', async () => {
      await dashboardPage.topupButton.click();
      await page.waitForURL((url) => url.pathname === '/topup-package', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Select the 150 Koin Emas package and continue to payment', async () => {
      await topupPage.selectPackage(PACKAGE_NAME);
      await topupPage.lanjutBayar();
      await page.waitForURL((url) => url.pathname.startsWith('/topup-payment-methods'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Select Dana e-wallet and pay now', async () => {
      await topupPage.selectPaymentMethod(PAYMENT_METHOD);
      await topupPage.bayarSekarang();
      await page.waitForURL((url) => url.hostname.includes('xendit'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Proceed to pay on the Xendit checkout page', async () => {
      await topupPage.proceedToPay();
      await page.waitForURL((url) => url.pathname === '/topup/success', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Verify the topup success message', async () => {
      await expect(topupPage.successMessage).toContainText(SUCCESS_MESSAGE, { timeout: Timeouts.RENDER });
    });
  });
});
