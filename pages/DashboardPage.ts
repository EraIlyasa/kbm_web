import { Locator, Page } from '@playwright/test';
import { Navbar } from '../components/Navbar.js';
import { Sidebar } from '../components/Sidebar.js';
import { URLs } from '../constants/URLs.js';

export class DashboardPage {
  public readonly navbar: Navbar;
  public readonly sidebar: Sidebar;
  public readonly title: Locator;
  public readonly productTable: Locator;

  constructor(private readonly page: Page) {
    this.navbar = new Navbar(this.page);
    this.sidebar = new Sidebar(this.page);
    this.title = this.page.getByRole('heading', { name: 'Dashboard', exact: true });
    this.productTable = this.page.getByRole('table', { name: 'Products List' });
  }

  /**
   * Navigates to the Dashboard page.
   */
  public async goto(): Promise<void> {
    await this.page.goto(URLs.PAGES.DASHBOARD);
  }
}
