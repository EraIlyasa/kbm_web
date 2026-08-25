import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class TimelinePage {
  public readonly inputTimelineTrigger: Locator;
  public readonly captionInput: Locator;
  public readonly fileInput: Locator;
  public readonly formImage: Locator;
  public readonly postButton: Locator;
  public readonly successModal: Locator;
  public readonly closeModalButton: Locator;

  constructor(private readonly page: Page) {
    this.inputTimelineTrigger = this.page.locator('.input-timeline');
    this.captionInput = this.page.locator('#text-image');
    this.fileInput = this.page.locator('input[type="file"]');
    this.formImage = this.page.locator('#form-image');
    this.postButton = this.page.locator('#share-image');
    this.successModal = this.page.locator('.swal2-modal');
    this.closeModalButton = this.page.locator('.swal2-close');
  }

  /**
   * Navigates to the timeline page.
   */
  public async goto(): Promise<void> {
    await this.page.goto('/timeline');
  }

  /**
   * Triggers validation on the legacy jQuery form by dispatching mouse events.
   */
  public async triggerFormValidation(): Promise<void> {
    await this.formImage.dispatchEvent('mouseenter');
    await this.formImage.dispatchEvent('mousemove');
  }

  /**
   * Locates a post card on the feed by its caption text.
   */
  public getPostByCaption(caption: string): Locator {
    return this.page.locator('.card-feed-timeline', { hasText: caption });
  }

  /**
   * Posts a timeline entry with a caption and an attached file.
   */
  public async postTimeline(caption: string, filePath: string): Promise<void> {
    await this.captionInput.fill(caption);
    await this.fileInput.setInputFiles(filePath);
    await this.triggerFormValidation();
    await this.postButton.click();
  }

  /**
   * Likes a post card.
   */
  public async likePost(postCard: Locator): Promise<void> {
    await postCard.locator('.like-post').first().click();
  }

  /**
   * Opens the comment box on a post card, writes a comment, and submits it.
   */
  public async addComment(postCard: Locator, commentText: string): Promise<void> {
    await postCard.locator('.comment-post').first().click();
    const commentTextarea = postCard.locator('textarea[placeholder*="Tuliskan komentar"]').first();
    await commentTextarea.waitFor({ state: 'visible', timeout: Timeouts.EXPECT });
    await commentTextarea.fill(commentText);
    await postCard.locator('button:has-text("Posting Komentar")').first().click();
  }
}
