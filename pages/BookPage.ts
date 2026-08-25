import { Locator, Page } from '@playwright/test';
import { URLs } from '../constants/URLs.js';

export class BookPage {
  public readonly bookTitle: Locator;

  constructor(private readonly page: Page) {
    this.bookTitle = this.page.getByRole('heading', { level: 1 });
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
}
