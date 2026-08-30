import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';
import { todayStamp } from '../../utils/DateTimeUtils.js';
import { ChapterCommentPage } from '../../pages/ChapterCommentPage.js';

const BOOK_TITLE = 'Automation Novel Buku';
const CHAPTER_NAME = 'Bab 1';
const EMOTIKON = '⭐';
const SUCCESS_MESSAGE = 'Berhasil mengirim komentar';

test.describe('Chapter Comment Specifications', () => {
  test('User should post a comment on a book chapter', { tag: ['@chapter-comment', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    bookPage,
    chapterCommentPage,
    page,
  }, testInfo) => {
    test.setTimeout(180000);

    const comment = ChapterCommentPage.buildComment(todayStamp(), EMOTIKON);

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

    await test.step('Open Bab 1 from the chapter section', async () => {
      await chapterCommentPage.openChapter(CHAPTER_NAME);
      await page.waitForURL((url) => url.pathname.startsWith('/book/read'), { timeout: Timeouts.PAGE_LOAD });
    });

    await test.step('Scroll to the comment field', async () => {
      await chapterCommentPage.scrollToCommentSection();
    });

    await test.step('Fill in the chapter comment', async () => {
      await chapterCommentPage.fillComment(comment);
    });

    await test.step('Post the comment', async () => {
      await chapterCommentPage.postComment();
    });

    await test.step('Verify the comment success message', async () => {
      await chapterCommentPage.waitForSuccessAlert();
      await expect(chapterCommentPage.successAlert).toContainText(SUCCESS_MESSAGE, { timeout: Timeouts.RENDER });
    });

    await test.step('Scroll down to confirm the comment appears in the list', async () => {
      await chapterCommentPage.commentCardContains(comment);
    });
  });
});
