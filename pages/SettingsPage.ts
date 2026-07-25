import { Locator, Page } from '@playwright/test';

export class SettingsPage {
  public readonly professionSelect: Locator;
  public readonly saveButton: Locator;
  
  // SweetAlert elements
  public readonly confirmDialog: Locator;
  public readonly agreeButton: Locator;
  
  // Notification alert
  public readonly successNotification: Locator;

  constructor(private readonly page: Page) {
    this.professionSelect = this.page.locator('#profession');
    this.saveButton = this.page.locator('#buttonSave');
    
    this.confirmDialog = this.page.locator('.swal2-modal');
    this.agreeButton = this.page.getByRole('button', { name: 'Setuju' });
    
    this.successNotification = this.page.locator('.alert-success');
  }

  /**
   * Navigates to the settings page.
   */
  public async goto(): Promise<void> {
    await this.page.goto('/pengaturan');
  }

  /**
   * Updates the user's occupation (profession) and saves the change.
   */
  public async updateOccupation(occupation: 'Buruh Pabrik' | 'Masinis'): Promise<void> {
    await this.professionSelect.selectOption({ label: occupation });
    await this.saveButton.scrollIntoViewIfNeeded();
    await this.saveButton.click();
  }

  /**
   * Confirms the changes on the SweetAlert overlay.
   */
  public async confirmChanges(): Promise<void> {
    await this.agreeButton.click();
  }
}
