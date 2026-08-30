import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class CategoryPage {
  public readonly categoryButton: Locator;
  public readonly categoryDropdown: Locator;
  public readonly categoryLink: (name: string) => Locator;

  constructor(private readonly page: Page) {
    // "Kategori" text button next to the book search field
    this.categoryButton = this.page.locator('button.dropbtn-category');
    this.categoryDropdown = this.page.locator('.dropdown-category-content');
    this.categoryLink = (name: string) => this.page.locator('a.btn-category-list').filter({ hasText: name });
  }

  /**
   * Opens the category dropdown by hovering over the "Kategori" text.
   */
  public async openCategoryDropdown(): Promise<void> {
    await this.categoryButton.hover();
    await this.categoryDropdown.waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }

  /**
   * Returns the number of categories currently visible in the dropdown.
   */
  public async getCategoryCount(): Promise<number> {
    return this.page.locator('a.btn-category-list:visible').count();
  }

  /**
   * Asserts that a given category name is shown in the dropdown.
   */
  public async hasCategory(name: string): Promise<void> {
    await this.categoryLink(name).first().waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }
}
