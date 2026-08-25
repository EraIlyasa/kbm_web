import { Locator, Page } from '@playwright/test';
import { URLs } from '../constants/URLs.js';
import { Timeouts } from '../constants/Timeouts.js';

export class ForgotPasswordPage {
  public readonly emailInput: Locator;
  public readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = this.page.getByPlaceholder('Alamat Email');
    this.submitButton = this.page.locator('#btn-forgot-password');
  }

  /**
   * Navigates to the forgot-password page.
   */
  public async goto(): Promise<void> {
    await this.page.goto(URLs.PAGES.FORGOT_PASSWORD);
  }

  /**
   * Fills the registered email and submits a password-reset request.
   */
  public async requestReset(email: string): Promise<void> {
    await this.emailInput.fill(email);
    // The submit button stays disabled until the reCAPTCHA callback fires.
    await this.submitButton.click({ timeout: Timeouts.RENDER });
  }
}
