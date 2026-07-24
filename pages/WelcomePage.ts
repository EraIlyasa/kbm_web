import { Locator, Page } from '@playwright/test';

export class WelcomePage {
  public readonly masukButton: Locator;
  public readonly daftarButton: Locator;

  constructor(private readonly page: Page) {
    // Locate elements semantically as links
    this.masukButton = this.page.getByRole('link', { name: 'Masuk', exact: true });
    this.daftarButton = this.page.getByRole('link', { name: 'Daftar', exact: true });
  }

  /**
   * Navigates to the welcome/landing page.
   */
  public async goto(): Promise<void> {
    await this.page.goto('/');
  }
}
