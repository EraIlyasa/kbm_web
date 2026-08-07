import { Locator, Page } from '@playwright/test';
import { Timeouts } from '../constants/Timeouts.js';

export class DashboardPage {
  // Live portal menu locators
  public readonly berandaLink: Locator;
  public readonly eventLink: Locator;
  public readonly freshLink: Locator;
  public readonly favorLink: Locator;
  public readonly sparkLink: Locator;
  public readonly ebookLink: Locator;
  public readonly topupButton: Locator;
  
  // Profile dropdown locators
  public readonly profileTrigger: Locator;
  public readonly profileMenu: {
    misiHarian: Locator;
    profile: Locator;
    menulis: Locator;
    daftarBuku: Locator;
    bacaanSaya: Locator;
    timeline: Locator;
    editBank: Locator;
    pengaturan: Locator;
    keluar: Locator;
  };

  constructor(private readonly page: Page) {
    const menuContainer = this.page.locator('#scrollbar-menu');
    this.berandaLink = menuContainer.getByRole('link', { name: 'Beranda', exact: true });
    this.eventLink = menuContainer.getByRole('link', { name: 'Event', exact: true });
    this.freshLink = menuContainer.getByRole('link', { name: 'Fresh', exact: true });
    this.favorLink = menuContainer.getByRole('link', { name: 'Favor', exact: true });
    this.sparkLink = menuContainer.getByRole('link', { name: 'Spark', exact: true });
    this.ebookLink = menuContainer.getByRole('link', { name: 'Ebook', exact: true });
    
    // Locate the Topup button flexibly as a link or button
    this.topupButton = this.page.getByRole('link', { name: 'Topup' })
      .or(this.page.getByRole('button', { name: 'Topup' }));

    // Define profile trigger button (dropbtn or no_image or mock fallback)
    this.profileTrigger = this.page.locator('.dropbtn')
      .or(this.page.getByRole('button', { name: 'no_image' }))
      .or(this.page.locator('.profile-container').getByRole('button', { name: 'Profile User' }));

    // Define profile trigger button and dropdown list options scoped to .dropdown-content container
    const dropdownContainer = this.page.locator('.dropdown-content').or(this.page.locator('.profile-container'));
    this.profileMenu = {
      misiHarian: dropdownContainer.getByRole('link', { name: 'Misi Harian' }),
      profile: dropdownContainer.getByRole('link', { name: 'Profile', exact: true }).or(dropdownContainer.getByRole('link', { name: 'Profil Saya' })),
      menulis: dropdownContainer.locator('#menulis1').or(dropdownContainer.getByRole('link', { name: 'Menulis' })),
      daftarBuku: dropdownContainer.getByRole('link', { name: 'Daftar Buku' }),
      bacaanSaya: dropdownContainer.getByRole('link', { name: 'Bacaan Saya' }),
      timeline: dropdownContainer.getByRole('link', { name: 'Timeline' }),
      editBank: dropdownContainer.getByRole('link', { name: 'Edit Bank' }),
      pengaturan: dropdownContainer.getByRole('link', { name: 'Pengaturan' }),
      keluar: dropdownContainer.getByRole('link', { name: 'Keluar' }),
    };
  }

  /**
   * Navigates to the Dashboard/Home page.
   */
  public async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Opens the profile dropdown by hovering over the profile trigger.
   */
  public async openProfileMenu(): Promise<void> {
    await this.profileTrigger.hover({ timeout: Timeouts.RENDER });
  }
}
