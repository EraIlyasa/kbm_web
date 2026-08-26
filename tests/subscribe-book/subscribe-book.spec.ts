import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsWithRetry } from '../../utils/AuthFlow.js';
import bestSellerBooks from '../../data/best-seller-books.json';

test.describe('Book Subscribe Specifications', () => {
  for (const bookTitle of bestSellerBooks) {
    test(`User should subscribe and unsubscribe the book "${bookTitle}"`, { tag: ['@subscribe', '@regression'] }, async ({
      welcomePage,
      loginPage,
      dashboardPage,
      bookPage,
      page,
    }, testInfo) => {
      test.setTimeout(180000);

      const account = Credentials.TEST_ACCOUNTS[testInfo.workerIndex % Credentials.TEST_ACCOUNTS.length];

      await test.step('Navigate to the landing page and login', async () => {
        await loginAsWithRetry({ page, welcomePage, loginPage }, account.email, account.password);
      });

      await test.step('Open a book from the Today Best Seller section', async () => {
        await dashboardPage.openBestSellerBook(bookTitle);
        await page.waitForURL((url) => url.pathname.startsWith('/book/detail'), { timeout: Timeouts.PAGE_LOAD });
      });

      await test.step('Subscribe to the book and verify the button turns green', async () => {
        await expect(bookPage.subscribeButtonText).toHaveText('Subscribe', { timeout: Timeouts.RENDER });
        await bookPage.subscribe();
        await expect(bookPage.subscribeButtonText).toHaveText('Unsubscribe', { timeout: Timeouts.RENDER });
        await expect(bookPage.subscribeButton).toHaveCSS('color', 'rgb(37, 211, 102)');
      });

      await test.step('Unsubscribe from the book', async () => {
        await bookPage.unsubscribe();
        await expect(bookPage.subscribeButtonText).toHaveText('Subscribe', { timeout: Timeouts.RENDER });
      });
    });
  }
});
