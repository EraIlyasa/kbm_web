import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';

test.describe('Writer Studio and Story Creation Specifications', () => {

  test('User should successfully create a new exclusive story', async ({
    welcomePage,
    loginPage,
    dashboardPage,
    writingPage,
    page,
  }, testInfo) => {
    // Set generous timeout for story creation processes
    test.setTimeout(90000);

    // Skip Chromium because headless Chrome is blocked by reCAPTCHA v2 on staging login
    test.skip(testInfo.project.name === 'chromium', 'Headless Chromium is blocked by reCAPTCHA v2');

    // Get current account dynamically based on workerIndex
    const account = Credentials.TEST_ACCOUNTS[testInfo.workerIndex % Credentials.TEST_ACCOUNTS.length];
    console.log(`Worker #${testInfo.workerIndex} (${testInfo.project.name}) logging in with account: ${account.email}`);

    await test.step('Navigate to the landing page and login', async () => {
      await welcomePage.goto();
      await welcomePage.masukButton.click();
      await loginPage.login(account.email, account.password);
      await page.waitForURL('https://dev-web.ccmhoster.com/', { timeout: 30000 });
      await page.waitForLoadState('load');
    });

    await test.step('Navigate to Menulis (Writer Studio) portal', async () => {
      // Hover profile trigger to show dropdown
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      // Click on Menulis link in the dropdown menu
      await dashboardPage.profileMenu.menulis.click();
      
      // Wait for redirection to writer studio portal (dev-write.ccmhoster.com)
      await page.waitForURL(/.*dev-write.*/, { timeout: 30000 });
      await page.waitForLoadState('load');
      // Wait for client hydration
      await page.waitForTimeout(5000);
    });

    await test.step('Create a new story with details and cover', async () => {
      // Form fields preparation
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const loremTitle = "Lorem Ipsum Dolor Si Amet Lorem Ipsum Dolor Si Amet Lorem Ipsum"; // ~60 characters
      const title = `Automation Testing ${loremTitle} - ${dateStr} - ${timeStr}`;
      const synopsis = "Ini adalah sinopsis untuk cerita testing otomasi yang dibuat oleh script Playwright minimal harus 51 karakter.";
      
      await writingPage.createNewStory(
        title,
        'Novel Fantasi',
        synopsis,
        'Automation Testing'
      );
      await page.waitForTimeout(2000);
    });

    await test.step('Accept exclusive story agreement terms', async () => {
      // Verify agreement checkbox and click it
      await expect(writingPage.agreeCheckbox).toBeVisible({ timeout: 10000 });
      await writingPage.acceptAgreement();
    });

    await test.step('Verify eksklusif success dialog and close it', async () => {
      // Verify the final success modal appears
      await expect(writingPage.successModal).toBeVisible({ timeout: 15000 });
      await expect(writingPage.successModal).toContainText('Selamat! Cerita kamu telah menjadi eksklusif KBM');
      
      // Click Tutup button to close the modal dialog
      await writingPage.tutupButton.click();
      await page.waitForTimeout(2000);
    });
  });

});
