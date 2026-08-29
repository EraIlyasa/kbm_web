import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class TransferPage {
  // User search area (step page 1: /coin/transfer)
  public readonly searchInput: Locator;
  public readonly searchForm: Locator;
  public readonly userCard: Locator;

  // Amount selection (step page 2: /coin/transfer/{userId})
  public readonly transferCoinForm: Locator;
  public readonly transferButton: Locator;

  // Confirmation & PIN dialogs (SweetAlert)
  public readonly confirmButton: Locator;
  public readonly pinKey: (digit: string) => Locator;
  public readonly successDialog: Locator;

  constructor(private readonly page: Page) {
    // Search user
    this.searchInput = this.page.locator('#search-input');
    this.searchForm = this.page.locator('#search-user-form');
    this.userCard = this.page.locator('.user-transfer-item');

    // Amount & submit
    this.transferCoinForm = this.page.locator('#transfer-coin-form');
    this.transferButton = this.page.locator('#btn-submit-transfer');

    // SweetAlert confirmation & PIN keypad
    this.confirmButton = this.page.locator('.swal2-confirm').first();
    this.pinKey = (digit: string) => this.page.locator(`.swal-key-btn[data-key="${digit}"]`);
    this.successDialog = this.page.locator('.swal2-popup');
  }

  /**
   * Searches for a recipient by username and submits the search.
   */
  public async searchUser(username: string): Promise<void> {
    await this.searchInput.fill(username);
    await this.searchForm.evaluate((form: HTMLFormElement) => form.requestSubmit());
  }

  /**
   * Selects a recipient card from the search result by its order (0-based index).
   * The search for "kbmkamal038" returns two matching cards; the recipient is the second one.
   */
  public async selectUserCard(index: number): Promise<void> {
    await this.userCard.nth(index).waitFor({ state: 'visible', timeout: Timeouts.RENDER });
    await this.userCard.nth(index).click();
  }

  /**
   * Selects a coin amount from the preset grid buttons (e.g. "15").
   */
  public async selectCoinAmount(amount: string): Promise<void> {
    await this.page.locator(`.coin-grid-btn[data-value="${amount}"]`).click();
  }

  /**
   * Clicks the "Transfer" button to open the confirmation dialog.
   */
  public async clickTransfer(): Promise<void> {
    await this.transferButton.click();
  }

  /**
   * Confirms the transfer on the Konfirmasi SweetAlert dialog.
   */
  public async confirmTransfer(): Promise<void> {
    await this.confirmButton.click();
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
   * Waits for the success dialog to appear after a successful transfer.
   */
  public async waitForSuccessDialog(): Promise<void> {
    await this.successDialog.waitFor({ state: 'visible', timeout: Timeouts.RENDER });
  }
}
