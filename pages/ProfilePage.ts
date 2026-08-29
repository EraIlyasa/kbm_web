import { Locator, Page } from '@playwright/test';

export class ProfilePage {
  public readonly fullNameInput: Locator;
  public readonly bioTextarea: Locator;
  public readonly submitButton: Locator;
  
  // SweetAlert Elements
  public readonly confirmDialog: Locator;
  public readonly agreeButton: Locator;
  
  // Success Toast Notification
  public readonly successNotification: Locator;

  // Quick menu action "Transfer" (circular icon with alt="Transfer")
  public readonly transferMenu: Locator;
  // Quick menu action "Tukar Koin" (circular icon)
  public readonly tukarKoinMenu: Locator;

  constructor(private readonly page: Page) {
    this.fullNameInput = this.page.locator('#full_name');
    this.bioTextarea = this.page.locator('#bio');
    this.submitButton = this.page.locator('#submitForm');
    
    this.confirmDialog = this.page.locator('.swal2-modal');
    this.agreeButton = this.page.getByRole('button', { name: 'Setuju' });
    
    // Select toast success container or success alert elements
    this.successNotification = this.page.locator('.toast, .alert-success, #toast-container').first();

    this.transferMenu = this.page.locator('[alt="Transfer"]').first();
    this.tukarKoinMenu = this.page.locator('a.menu-action-item', { hasText: 'Tukar Koin' }).first();
  }

  /**
   * Navigates to the profile page.
   */
  public async goto(): Promise<void> {
    await this.page.goto('/profile-user');
  }

  /**
   * Updates the profile bio and submits the form.
   */
  public async updateBio(bio: string): Promise<void> {
    await this.bioTextarea.fill(bio);
    await this.submitButton.scrollIntoViewIfNeeded();
    await this.submitButton.click();
  }

  /**
   * Confirms the changes on the SweetAlert overlay.
   */
  public async confirmChanges(): Promise<void> {
    await this.agreeButton.click();
  }

  /**
   * Opens the coin transfer flow by clicking the circular "Transfer" quick menu.
   */
  public async openTransfer(): Promise<void> {
    await this.transferMenu.click();
  }

  /**
   * Opens the coin exchange flow by clicking the circular "Tukar Koin" quick menu.
   */
  public async openTukarKoin(): Promise<void> {
    await this.tukarKoinMenu.click();
  }
}
