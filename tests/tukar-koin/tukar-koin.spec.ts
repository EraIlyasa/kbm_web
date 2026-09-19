import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';

// The Tukar Koin quick menu is only available on the account at index 1 (kamalyasya20@gmail.com),
// so login is pinned to that account instead of rotating per worker.
const EXCHANGE_ACCOUNT_INDEX = 1;
const COIN_AMOUNT = '1';
const E_WALLET_PIN = '123456';
const SUCCESS_MESSAGE = 'Penukaran koin berhasil';

test.describe('Tukar Koin Specifications', () => {
  test('User should exchange gold coins from silver via Tukar Koin', { tag: ['@tukar-koin', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    profilePage,
    exchangePage,
    page,
  }) => {
    test.setTimeout(180000);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAsTestUser({ page, welcomePage, loginPage }, EXCHANGE_ACCOUNT_INDEX);
    });

    await test.step('Open the profile page from the profile dropdown', async () => {
      await dashboardPage.openProfileMenu();
      await dashboardPage.profileMenu.profile.click();
      await page.waitForURL((url) => url.pathname === '/profile-user', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Open the Tukar Koin page from the circular quick action', async () => {
      await profilePage.openTukarKoin();
      await page.waitForURL((url) => url.pathname === '/coin/exchange', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Select 1 gold coin nominal and start the exchange', async () => {
      await exchangePage.selectCoinAmount(COIN_AMOUNT);
      await exchangePage.clickTukarKoin();
    });

    await test.step('Confirm the exchange in the Tukar Sekarang dialog', async () => {
      await exchangePage.confirmExchange();
    });

    await test.step('Enter the E-Wallet PIN to authorise the exchange', async () => {
      await exchangePage.enterPin(E_WALLET_PIN);
    });

    await test.step('Verify the exchange success message', async () => {
      await exchangePage.waitForSuccessDialog();
      await expect(exchangePage.successDialog).toContainText(SUCCESS_MESSAGE, { timeout: Timeouts.RENDER });
    });
  });
});
