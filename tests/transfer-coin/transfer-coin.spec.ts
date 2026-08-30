import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';

// The Transfer quick menu is only available on the account at index 1 (kamalyasya20@gmail.com),
// so login is pinned to that account instead of rotating per worker.
const TRANSFER_ACCOUNT_INDEX = 1;
const RECIPIENT_USERNAME = 'kbmkamal038';
// Index of the recipient card to select in the search results (0-based).
const RECIPIENT_CARD_INDEX = 1;
const COIN_AMOUNT = '15';
const E_WALLET_PIN = '123456';
const SUCCESS_MESSAGE = 'Transfer berhasil';

test.describe('Transfer Coin Specifications', () => {
  test('User should transfer 15 gold coins to another user', { tag: ['@transfer-coin', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    profilePage,
    transferPage,
    page,
  }) => {
    test.setTimeout(180000);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAsTestUser({ page, welcomePage, loginPage }, TRANSFER_ACCOUNT_INDEX);
    });

    await test.step('Open the profile page from the profile dropdown', async () => {
      await dashboardPage.openProfileMenu();
      await dashboardPage.profileMenu.profile.click();
      await page.waitForURL((url) => url.pathname === '/profile-user', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Open the coin transfer menu from the circular quick action', async () => {
      await profilePage.openTransfer();
      await page.waitForURL((url) => url.pathname === '/coin/transfer', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Search for the recipient user', async () => {
      await transferPage.searchUser(RECIPIENT_USERNAME);
    });

    await test.step('Select the recipient card from the search results', async () => {
      await transferPage.selectUserCard(RECIPIENT_CARD_INDEX);
      await page.waitForURL((url) => url.pathname.startsWith('/coin/transfer/'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Select 15 gold coins and start the transfer', async () => {
      await transferPage.selectCoinAmount(COIN_AMOUNT);
      await transferPage.clickTransfer();
    });

    await test.step('Confirm the transfer in the confirmation dialog', async () => {
      await transferPage.confirmTransfer();
    });

    await test.step('Enter the E-Wallet PIN to authorise the transfer', async () => {
      await transferPage.enterPin(E_WALLET_PIN);
    });

    await test.step('Verify the transfer success message', async () => {
      await transferPage.waitForSuccessDialog();
      await expect(transferPage.successDialog).toContainText(SUCCESS_MESSAGE, { timeout: Timeouts.RENDER });
    });
  });
});
