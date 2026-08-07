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

  constructor(private readonly page: Page) {
    this.fullNameInput = this.page.locator('#full_name');
    this.bioTextarea = this.page.locator('#bio');
    this.submitButton = this.page.locator('#submitForm');
    
    this.confirmDialog = this.page.locator('.swal2-modal');
    this.agreeButton = this.page.getByRole('button', { name: 'Setuju' });
    
    // Select toast success container or success alert elements
    this.successNotification = this.page.locator('.toast, .alert-success, #toast-container').first();
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
}
