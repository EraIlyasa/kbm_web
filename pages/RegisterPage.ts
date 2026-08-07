import { Locator, Page } from '@playwright/test';
import { URLs } from '../constants/URLs.js';
import { Timeouts } from '../constants/Timeouts.js';

export class RegisterPage {
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    // { exact: true } prevents "Kata Sandi" from matching the "Konfirmasi Kata Sandi" label.
    this.emailInput = this.page.getByLabel('Email');
    this.passwordInput = this.page.getByLabel('Kata Sandi', { exact: true });
    this.confirmPasswordInput = this.page.getByLabel('Konfirmasi Kata Sandi', { exact: true });
    // #btn-register mirrors the #btn-forgot-password pattern used on ForgotPasswordPage.
    this.submitButton = this.page.locator('#btn-register');
  }

  /**
   * Navigates to the register page.
   */
  public async goto(): Promise<void> {
    await this.page.goto(URLs.PAGES.REGISTER);
  }

  /**
   * Fills the registration form fields: email, password and password confirmation.
   */
  public async fillRegisterForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  /**
   * Clicks the "Daftar" submit button. The button starts disabled and is only
   * enabled once the reCAPTCHA v3 callback fires, so Playwright waits up to
   * Timeouts.RENDER for it to become actionable.
   */
  public async submit(): Promise<void> {
    await this.submitButton.click({ timeout: Timeouts.RENDER });
  }
}
