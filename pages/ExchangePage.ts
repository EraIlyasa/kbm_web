import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class ExchangePage {
  // Amount selection (Tukar Koin, /coin/exchange)
  public readonly coinAmountButton: (amount: string) => Locator;
  public readonly tukarKoinButton: Locator;

  // Confirmation & PIN dialogs (SweetAlert)
  public readonly tukarSekarangButton: Locator;
  public readonly pinKey: (digit: string) => Locator;
  public readonly successDialog: Locator;

  constructor(private readonly page: Page) {
    this.coinAmountButton = (amount: string) => this.page.locator(`.coin-grid-btn[data-value="${amount}"]`);
    this.tukarKoinButton = this.page.locator('#btn-submit-exchange');

    this.tukarSekarangButton = this.page.locator('.swal2-confirm').first();
    this.pinKey = (digit: string) => this.page.locator(`.swal-key-btn[data-key="${digit}"]`);
    this.successDialog = this.page.locator('.swal2-popup');
  }

  /**
   * Selects a gold coin nominal from the exchange grid buttons (e.g. "1").
   */
  public async selectCoinAmount(amount: string): Promise<void> {
    await this.coinAmountButton(amount).click();
  }

  /**
   * Clicks the "Tukar Koin" button to open the confirmation dialog.
   */
  public async clickTukarKoin(): Promise<void> {
    await this.tukarKoinButton.click();
  }

  /**
   * Confirms the exchange on the "Tukar Sekarang" SweetAlert dialog.
   */
  public async confirmExchange(): Promise<void> {
    await this.tukarSekarangButton.click();
  }

  /**
   * Enters the 6-digit E-Wallet PIN via the on-screen keypad (e.g. "123456").
   */
  public async enterPin(pin: string): Promise<void> {
    for (const digit of pin) {
      await this.pinKey(digit).click();
    }
  }

  /**
   * Waits for the success dialog to appear after a successful exchange.
   */
  public async waitForSuccessDialog(): Promise<void> {
    await this.successDialog.waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }
}
