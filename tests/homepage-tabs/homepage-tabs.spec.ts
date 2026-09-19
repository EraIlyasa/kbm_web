import { Locator } from '@playwright/test';
import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';
import { DashboardPage } from '../../pages/DashboardPage.js';

test.describe('Homepage Tabs Specifications', () => {
  test('User should open each homepage tab and see the book listing screen', { tag: ['@homepage-tabs', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    page,
  }, testInfo) => {
    test.setTimeout(180000);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAsTestUser({ page, welcomePage, loginPage }, testInfo.workerIndex);
    });

    const tabs: Array<{ name: string; getLocator: (dashboard: DashboardPage) => Locator; expectedPath: string }> = [
      { name: 'Beranda', getLocator: (d) => d.berandaLink, expectedPath: '/' },
      { name: 'Event', getLocator: (d) => d.eventLink, expectedPath: '/menu' },
      { name: 'Fresh', getLocator: (d) => d.freshLink, expectedPath: '/menu' },
      { name: 'Favor', getLocator: (d) => d.favorLink, expectedPath: '/menu' },
      { name: 'Spark', getLocator: (d) => d.sparkLink, expectedPath: '/menu' },
      { name: 'Ebook', getLocator: (d) => d.ebookLink, expectedPath: '/menu' },
    ];

    for (const tab of tabs) {
      await test.step(`Open the ${tab.name} tab and verify the screen loads with book listings`, async () => {
        await tab.getLocator(dashboardPage).click();
        await expect(page).toHaveURL((url) => url.pathname === tab.expectedPath, { timeout: Timeouts.PAGE_LOAD });
        await expect(page.locator('a[href*="/book"]:visible').first()).toBeVisible({ timeout: Timeouts.RENDER });
      });

      await dashboardPage.goto();
    }
  });
});
