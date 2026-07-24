import { Locator, Page } from '@playwright/test';

export class Sidebar {
  public readonly container: Locator;
  private readonly dashboardLink: Locator;
  private readonly inventoryLink: Locator;

  constructor(private readonly page: Page) {
    this.container = this.page.getByRole('complementary', { name: 'Sidebar Navigation' });
    this.dashboardLink = this.container.getByRole('link', { name: 'Dashboard' });
    this.inventoryLink = this.container.getByRole('link', { name: 'Inventory' });
  }

  /**
   * Navigates to the Dashboard page from the sidebar.
   */
  public async clickDashboard(): Promise<void> {
    await this.dashboardLink.click();
  }

  /**
   * Navigates to the Inventory page from the sidebar.
   */
  public async clickInventory(): Promise<void> {
    await this.inventoryLink.click();
  }
}
