import { Locator, Page } from '@playwright/test';

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
}
