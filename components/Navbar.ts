import { Locator, Page } from '@playwright/test';

export class Navbar {
  public readonly container: Locator;
  private readonly logoutButton: Locator;
  private readonly profileName: Locator;

  constructor(private readonly page: Page) {
    this.container = this.page.getByRole('navigation', { name: 'Main Navigation' });
    this.logoutButton = this.container.getByRole('button', { name: 'Logout' });
    this.profileName = this.container.getByTestId('profile-name');
  }

  /**
   * Performs the logout action.
   */
  public async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Retrieves the displayed profile name.
   */
  public async getProfileName(): Promise<string> {
    return (await this.profileName.textContent()) || '';
  }
}
