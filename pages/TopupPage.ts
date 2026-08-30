import { Locator, Page } from '@playwright/test';

export class TopupPage {
  public readonly proceedButton: Locator;
  public readonly successMessage: Locator;

  constructor(private readonly page: Page) {
    this.proceedButton = this.page.locator('#proceed-button');
    this.successMessage = this.page.getByText('Yeayy, sekarang waktunya kamu untuk nikmati keseruan berbagai cerita di KBM.');
  }

  /**
   * Selects a coin package by its display name (e.g. "150 Koin Emas").
   */
  public async selectPackage(name: string): Promise<void> {
    await this.page.locator('label.card-topup-package', { hasText: name }).click();
  }

  /**
   * Clicks the "Lanjut Bayar" button to proceed to payment method selection.
   */
  public async lanjutBayar(): Promise<void> {
    await this.page.locator('#btn-pay').click();
  }

  /**
   * Selects a payment method by its data-code (e.g. "ID_DANA").
   */
  public async selectPaymentMethod(dataCode: string): Promise<void> {
    await this.page.locator(`input.check-payment-methods[data-code="${dataCode}"]`).check({ force: true });
  }

  /**
   * Clicks the "Bayar Sekarang" button to create the payment checkout.
   */
  public async bayarSekarang(): Promise<void> {
    await this.page.locator('#btn-pay-now').click();
  }

  /**
   * Clicks the "Proceed to Pay" button on the Xendit sandbox checkout page.
   */
  public async proceedToPay(): Promise<void> {
    await this.proceedButton.click();
  }
}
