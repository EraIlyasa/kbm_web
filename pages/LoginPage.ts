import { Locator, Page } from '@playwright/test';
import { URLs } from '../constants/URLs.js';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  public readonly errorMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = this.page.getByLabel('Nama Pengguna/Email');
    this.passwordInput = this.page.getByLabel('Kata Sandi');
    this.loginButton = this.page.getByRole('button', { name: 'Masuk', exact: true });
    this.errorMessage = this.page.getByRole('alert');
  }

  /**
   * Navigates to the login page.
   */
  public async goto(): Promise<void> {
    await this.page.goto(URLs.PAGES.LOGIN);
  }

  /**
   * Performs the login interaction.
   */
  public async login(email: string, password?: string): Promise<void> {
    await this.emailInput.fill(email);
    if (password) {
      await this.passwordInput.fill(password);
    }
    await this.loginButton.click();
  }
}
