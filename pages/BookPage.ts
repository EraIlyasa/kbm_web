import { Locator, Page } from '@playwright/test';
import { URLs } from '../constants/URLs.js';
import { Timeouts } from '../constants/Timeouts.js';

export class BookPage {
  public readonly bookTitle: Locator;
  public readonly subscribeButton: Locator;
  public readonly subscribeButtonText: Locator;

  constructor(private readonly page: Page) {
    this.bookTitle = this.page.getByRole('heading', { level: 1 });
    this.subscribeButton = this.page.locator('button.subscribe-post');
    this.subscribeButtonText = this.subscribeButton.locator('.button-text');
  }

  /**
   * Navigates to the book search results page.
   */
  public async goto(): Promise<void> {
    await this.page.goto(URLs.PAGES.BOOK);
  }

  /**
   * Locates a book card on the search results page by its title.
   */
  public getBookCard(title: string): Locator {
    return this.page.locator('a.book-content').filter({ has: this.page.locator(`img[alt*="${title}"]`) });
  }

  /**
   * Opens a book from the search results by clicking its card.
   */
  public async openBook(title: string): Promise<void> {
    await this.getBookCard(title).click();
  }

  /**
   * Returns the current subscribe button text ("Subscribe" or "Unsubscribe").
   */
  public async getSubscribeState(): Promise<string> {
    return (await this.subscribeButtonText.textContent())?.trim() ?? '';
  }

  /**
   * Subscribes to the book and waits until the button settles (shows
   * "Unsubscribe", no loading spinner, enabled again).
   */
  public async subscribe(): Promise<void> {
    await this.subscribeButton.click();
    await this.waitForSubscribeState('Unsubscribe');
  }

  /**
   * Unsubscribes from the book and waits until the button settles (shows
   * "Subscribe", no loading spinner, enabled again).
   */
  public async unsubscribe(): Promise<void> {
    await this.subscribeButton.click();
    await this.waitForSubscribeState('Subscribe');
  }

  /**
   * Resets the book to the "not subscribed" state if it is already subscribed.
   * Makes the scenario idempotent across runs.
   */
  public async ensureUnsubscribed(): Promise<void> {
    const state = await this.getSubscribeState();
    if (state === 'Unsubscribe') {
      await this.unsubscribe();
    }
  }

  private async waitForSubscribeState(expected: 'Subscribe' | 'Unsubscribe'): Promise<void> {
    await this.page.waitForFunction(
      (text) => {
        const button = document.querySelector('button.subscribe-post');
        if (!button) return false;
        const buttonText = button.querySelector('.button-text')?.textContent?.trim();
        return buttonText === text && !button.classList.contains('loading') && !button.hasAttribute('disabled');
      },
      expected,
      { timeout: Timeouts.RENDER },
    );
  }
}
