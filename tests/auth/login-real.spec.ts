import { test, expect } from '../../fixtures/page.fixture.js';

test.describe('Real Authentication and Landing Menu Specifications', () => {

  test('User should login with real credentials and verify landing menu elements', async ({
    welcomePage,
    loginPage,
    dashboardPage,
    settingsPage,
    page,
  }, testInfo) => {
    // Allow up to 60 seconds for real website logins and settings updates
    test.setTimeout(60000);

    // Skip Chromium on real login because headless Chrome is blocked by reCAPTCHA v2 on the live site
    test.skip(testInfo.project.name === 'chromium', 'Headless Chromium is blocked by reCAPTCHA v2');

    // Act
    await test.step('Navigate to the landing page', async () => {
      await welcomePage.goto();
    });

    await test.step('Click Masuk to navigate to login page', async () => {
      await welcomePage.masukButton.click();
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Fill in real credentials and submit login form', async () => {
      // Inputs: Nama Pengguna/Email: yasya.kamal@gmail.com, Kata Sandi: 1234567890
      await loginPage.login('yasya.kamal@gmail.com', '1234567890');
      
      // Wait for redirect to home page (gives time for authentication & reCAPTCHA score verification)
      await page.waitForURL('https://dev-web.ccmhoster.com/', { timeout: 30000 });
      
      // Wait until the page has loaded
      await page.waitForLoadState('load');
    });

    // Assert
    await test.step('Verify Topup button appears after successful login', async () => {
      await expect(dashboardPage.topupButton).toBeVisible({ timeout: 15000 });
    });

    await test.step('Hover profile trigger and verify all menu items appear', async () => {
      // Hover profile trigger to show dropdown (generous timeout for rendering animations)
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });

      // Verify visibility of all submenu options
      await expect(dashboardPage.profileMenu.misiHarian).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.profile).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.menulis).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.daftarBuku).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.bacaanSaya).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.timeline).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.editBank).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.pengaturan).toBeVisible({ timeout: 10000 });
      await expect(dashboardPage.profileMenu.keluar).toBeVisible({ timeout: 10000 });
    });

    await test.step('Navigate to Pengaturan (Settings) page', async () => {
      // Click on Pengaturan link in the dropdown menu
      await dashboardPage.profileMenu.pengaturan.click();
      await page.waitForURL('**/pengaturan', { timeout: 20000 });
      await page.waitForLoadState('load');
    });

    await test.step('Change occupation to Buruh Pabrik and verify confirmation dialog & success notification', async () => {
      // Change occupation from current (starts as Masinis) to Buruh Pabrik
      await settingsPage.updateOccupation('Buruh Pabrik');

      // Verify the SweetAlert "Informasi" dialog appears
      await expect(settingsPage.confirmDialog).toBeVisible({ timeout: 10000 });
      
      // Click Setuju to confirm
      await settingsPage.confirmChanges();

      // Verify success toast notification appears immediately
      await expect(settingsPage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: 5000 });
    });

    await test.step('Change occupation back to Masinis and verify confirmation dialog & success notification', async () => {
      // Change occupation from Buruh Pabrik back to Masinis
      await settingsPage.updateOccupation('Masinis');

      // Verify the SweetAlert "Informasi" dialog appears
      await expect(settingsPage.confirmDialog).toBeVisible({ timeout: 10000 });
      
      // Click Setuju to confirm
      await settingsPage.confirmChanges();

      // Verify success toast notification appears immediately
      await expect(settingsPage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: 5000 });
    });
  });

});
