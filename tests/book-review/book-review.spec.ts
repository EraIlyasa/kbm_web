import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';
import { todayStamp } from '../../utils/DateTimeUtils.js';
import { BookReviewPage } from '../../pages/BookReviewPage.js';

const BOOK_TITLE = 'Automation Novel Buku';
const RATING = 5;
const EMOTIKON = '⭐';
const SUCCESS_MESSAGE = 'Berhasil memberi ulasan.';

test.describe('Book Rating & Comment Specifications', () => {
  test('User should rate a book and post a review comment', { tag: ['@book-review', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    bookPage,
    bookReviewPage,
    page,
  }, testInfo) => {
    test.setTimeout(180000);

    const comment = BookReviewPage.buildComment(todayStamp(), EMOTIKON);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAsTestUser({ page, welcomePage, loginPage }, testInfo.workerIndex);
    });

    await test.step('Search the book and open the first result', async () => {
      await dashboardPage.searchBook(BOOK_TITLE);
      await page.waitForURL((url) => url.pathname === '/book', { timeout: Timeouts.PAGE_LOAD });
      await page.locator('a.book-content').first().waitFor({ state: 'visible', timeout: Timeouts.RENDER });
      await page.locator('a.book-content').first().click();
      await page.waitForURL((url) => url.pathname.startsWith('/book/detail'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Scroll to the review section', async () => {
      await bookReviewPage.scrollToReviewSection();
    });

    await test.step('Rate the book with 5 stars', async () => {
      await bookReviewPage.rateStars(RATING);
    });

    await test.step('Fill in the review comment', async () => {
      await bookReviewPage.fillComment(comment);
    });

    await test.step('Post the review', async () => {
      await bookReviewPage.postReview();
    });

    await test.step('Verify the review success message', async () => {
      await bookReviewPage.waitForSuccessAlert();
      await expect(bookReviewPage.successAlert).toContainText(SUCCESS_MESSAGE, { timeout: Timeouts.RENDER });
    });

    await test.step('Scroll down to confirm the comment appears in the review list', async () => {
      await expect(async () => {
        await bookReviewPage.reviewCardContains(comment);
      }).toPass({ timeout: Timeouts.NAVIGATION });
    });
  });
});
