import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class ChapterCommentPage {
  public readonly chapterCard: Locator;
  public readonly commentTextarea: Locator;
  public readonly postCommentButton: Locator;
  public readonly successAlert: Locator;
  public readonly commentCard: Locator;

  constructor(private readonly page: Page) {
    this.chapterCard = this.page.locator('a.card-chapter, .card-chapter, a[href*="/book/read"]');
    this.commentTextarea = this.page.locator('#text-comment-1');
    this.postCommentButton = this.page.locator('#btn-comment-1');
    this.successAlert = this.page.locator('.swal2-popup');
    this.commentCard = this.page.locator('.card-comment');
  }

  /**
   * Opens a chapter by its display name (e.g. "Bab 1") from the book detail page.
   */
  public async openChapter(name: string): Promise<void> {
    const chapter = this.page.locator('a[href*="/book/read"]').filter({ hasText: name }).first();
    await chapter.scrollIntoViewIfNeeded();
    const href = await chapter.getAttribute('href');
    if (href) {
      await this.page.goto(href);
    } else {
      await chapter.click();
    }
  }

  /**
   * Scrolls the chapter comment form into view.
   */
  public async scrollToCommentSection(): Promise<void> {
    await this.commentTextarea.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(Timeouts.SETTLE);
  }

  /**
   * Fills the chapter comment into the textarea.
   */
  public async fillComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
  }

  /**
   * Clicks the "Posting Komentar" button to submit the comment.
   */
  public async postComment(): Promise<void> {
    await this.postCommentButton.click();
  }

  /**
   * Waits for the success alert to appear after the comment is submitted.
   */
  public async waitForSuccessAlert(): Promise<void> {
    await this.successAlert.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION });
  }

  /**
   * Scrolls to the comment list and asserts a comment card containing `comment`.
   */
  public async commentCardContains(comment: string): Promise<void> {
    await this.commentCard.first().scrollIntoViewIfNeeded();
    const card = this.commentCard.filter({ hasText: comment }).first();
    await card.waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }

  /**
   * Returns the chapter comment anchor text (date-time based) used to keep runs
   * unique while remaining verifiable in the comment list.
   */
  public static buildComment(dateTime: string, emotikon: string): string {
    return `Automated Bab Comment - ${dateTime} - ${emotikon}`;
  }
}
