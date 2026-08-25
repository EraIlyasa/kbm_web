import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAs } from '../../utils/AuthFlow.js';

const BOOK_TITLE = 'Automation Novel Buku';

test.describe('Book Search Specifications', () => {
  test('User should search a book and verify its title', { tag: ['@search', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    bookPage,
    page,
  }, testInfo) => {
    test.setTimeout(180000);

    const account = Credentials.TEST_ACCOUNTS[testInfo.workerIndex % Credentials.TEST_ACCOUNTS.length];

    await test.step('Navigate to the landing page and login', async () => {
      await loginAs({ page, welcomePage, loginPage }, account.email, account.password);
    });

    await test.step('Search a book by its title', async () => {
      await dashboardPage.searchBook(BOOK_TITLE);
      await page.waitForURL((url) => url.pathname === '/book', { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Open the book from the search results', async () => {
      await bookPage.openBook(BOOK_TITLE);
      await page.waitForURL((url) => url.pathname.startsWith('/book/detail'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Verify the book title', async () => {
      await expect(bookPage.bookTitle).toHaveText(BOOK_TITLE, { timeout: Timeouts.RENDER });
    });
  });
});
