import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class BookReviewPage {
  public readonly ulasanSayaText: Locator;
  public readonly ratingStars: Locator;
  public readonly editRatingIcon: Locator;
  public readonly commentTextarea: Locator;
  public readonly postReviewButton: Locator;
  public readonly successAlert: Locator;
  public readonly reviewCard: Locator;

  constructor(private readonly page: Page) {
    this.ulasanSayaText = this.page.getByText('Ulasan Saya', { exact: true });
    this.ratingStars = this.page.locator('#rating-stars .star');
    this.editRatingIcon = this.page.locator('#edit-rating');
    this.commentTextarea = this.page.locator('#text-comment-1');
    this.postReviewButton = this.page.locator('#btn-ulasan');
    this.successAlert = this.page.locator('.swal2-popup');
    this.reviewCard = this.page.locator('.card-ulasan');
  }

  /**
   * Scrolls the book review form ("Ulasan Saya" section) into view.
   */
  public async scrollToReviewSection(): Promise<void> {
    await this.ulasanSayaText.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(Timeouts.SETTLE);
  }

  /**
   * Rates the book by selecting the star with the given value (1..5).
   *
   * If the edit (pencil) icon is present, the stars are locked until it is
   * clicked first; otherwise the rightmost/desired star is clicked directly.
   */
  public async rateStars(value: number): Promise<void> {
    if (await this.editRatingIcon.isVisible().catch(() => false)) {
      await this.editRatingIcon.click();
    }
    await this.page.locator(`#rating-stars .star[data-value="${value}"]`).click();
  }

  /**
   * Fills the review comment into the textarea.
   */
  public async fillComment(comment: string): Promise<void> {
    await this.commentTextarea.fill(comment);
  }

  /**
   * Clicks the "Posting Ulasan" button to submit the rating and comment.
   */
  public async postReview(): Promise<void> {
    await this.postReviewButton.click();
  }

  /**
   * Waits for the success dialog to appear after a review is submitted.
   */
  public async waitForSuccessAlert(): Promise<void> {
    await this.successAlert.waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }

  /**
   * Scrolls to the review list and asserts a review card containing `comment`.
   */
  public async reviewCardContains(comment: string): Promise<boolean> {
    await this.reviewCard.first().scrollIntoViewIfNeeded();
    const card = this.reviewCard.filter({ hasText: comment }).first();
    await card.waitFor({ state: 'visible', timeout: Timeouts.NAVIGATION });
    return true;
  }

  /**
   * Returns the review comment anchor text (date-time based) used to keep runs
   * unique while remaining verifiable in the review list.
   */
  public static buildComment(dateTime: string, emotikon: string): string {
    return `Automated Comment - ${dateTime} - ${emotikon}`;
  }
}
