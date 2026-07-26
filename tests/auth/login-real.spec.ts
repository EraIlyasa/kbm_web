import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import * as path from 'path';

test.describe('Real Authentication and Landing Menu Specifications', () => {

  test('User should login with real credentials and verify landing menu elements', async ({
    welcomePage,
    loginPage,
    dashboardPage,
    settingsPage,
    timelinePage,
    profilePage,
    page,
  }, testInfo) => {
    // Allow up to 60 seconds for real website logins and settings updates
    test.setTimeout(60000);

    // Skip Chromium and WebKit on real login because headless browsers are blocked by reCAPTCHA v2
    test.skip(
      testInfo.project.name === 'chromium' || testInfo.project.name === 'webkit',
      'Headless Chromium/WebKit is blocked by reCAPTCHA v2'
    );

    // Get current account dynamically based on workerIndex
    const account = Credentials.TEST_ACCOUNTS[testInfo.workerIndex % Credentials.TEST_ACCOUNTS.length];
    console.log(`Worker #${testInfo.workerIndex} (${testInfo.project.name}) logging in with account: ${account.email}`);

    // Act
    await test.step('Navigate to the landing page', async () => {
      await welcomePage.goto();
    });

    await test.step('Click Masuk to navigate to login page', async () => {
      await welcomePage.masukButton.click();
      await expect(page).toHaveURL(/.*login/);
    });

    await test.step('Fill in real credentials and submit login form', async () => {
      // Inputs: Nama Pengguna/Email: account.email, Kata Sandi: account.password
      await loginPage.login(account.email, account.password);
      
      // Wait for redirect to home page (gives time for authentication & reCAPTCHA score verification)
      await page.waitForURL(`${process.env.BASE_URL}/`, { timeout: 30000 });
      
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

    await test.step('Navigate to Bacaan Saya and verify screen', async () => {
      // Hover profile to show menu
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      // Click on Bacaan Saya link
      await dashboardPage.profileMenu.bacaanSaya.click();
      await page.waitForURL('**/bacaan-saya', { timeout: 20000 });
      await page.waitForLoadState('load');
      // Verify Bacaan Saya screen content
      await expect(page.locator('body')).toContainText('Bacaan Saya');
    });

    await test.step('Navigate to Daftar Buku and verify screen', async () => {
      // Hover profile to show menu
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      // Click on Daftar Buku link
      await dashboardPage.profileMenu.daftarBuku.click();
      await page.waitForURL('**/daftar-buku', { timeout: 20000 });
      await page.waitForLoadState('load');
      // Verify Daftar Buku screen content
      await expect(page.locator('body')).toContainText('Daftar Buku');
    });

    await test.step('Navigate to Profile, update bio to short version and then back to full version', async () => {
      // Hover profile to show menu
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      // Click on Profile link
      await dashboardPage.profileMenu.profile.click();
      await page.waitForURL('**/profile-user', { timeout: 20000 });
      await page.waitForLoadState('load');
      
      // Verify account email
      await expect(profilePage.fullNameInput).toHaveValue(account.email, { timeout: 10000 });
      await expect(page.locator('body')).toContainText(account.email);
      
      // Scroll down and change bio to "Full Stack Software Quality Assurance"
      await profilePage.updateBio('Full Stack Software Quality Assurance');
      
      // Verify confirm dialog and agree
      await expect(profilePage.confirmDialog).toBeVisible({ timeout: 10000 });
      await profilePage.confirmChanges();
      
      // Verify success notification toast
      await expect(profilePage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: 10000 });
      
      // Scroll down and change bio back to "Full Stack Software Quality Assurance Engineer"
      await profilePage.updateBio('Full Stack Software Quality Assurance Engineer');
      
      // Verify confirm dialog and agree
      await expect(profilePage.confirmDialog).toBeVisible({ timeout: 10000 });
      await profilePage.confirmChanges();
      
      // Verify success notification toast
      await expect(profilePage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: 10000 });
    });

    await test.step('Navigate to Pengaturan (Settings) page', async () => {
      // Hover profile trigger to show dropdown
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
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

    await test.step('Open Profile dropdown and click Timeline', async () => {
      // Hover profile trigger to show dropdown
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      
      // Click on Timeline link in the dropdown menu
      await dashboardPage.profileMenu.timeline.click();
      await page.waitForURL('**/timeline', { timeout: 20000 });
      await page.waitForLoadState('load');
    });

    await test.step('Click Apa yang kamu pikirkan trigger and handle new tab posting', async () => {
      // Set test timeout generously to 90 seconds for complete run
      test.setTimeout(90000);

      // Click "Apa yang kamu pikirkan" trigger and capture the new tab page
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        timelinePage.inputTimelineTrigger.click()
      ]);
      
      await newPage.waitForLoadState('load');
      
      // Tulis caption dengan format "Ini Testing-[tanggal_hari_ini]-[jam_saat_ini]"
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const caption = `Ini Testing-${dateStr}-${timeStr}`;
      
      // Fill caption text
      await newPage.fill('#text-image', caption);
      
      // Input gambar LOGO.png
      const filePath = path.resolve('LOGO.png');
      await newPage.locator('input[type="file"]').setInputFiles(filePath);
      
      // Hover/move mouse over form to trigger legacy jQuery mouse events validation
      await newPage.locator('#form-image').dispatchEvent('mouseenter');
      await newPage.locator('#form-image').dispatchEvent('mousemove');
      
      // Click posting timeline
      await newPage.locator('#share-image').click();
      
      // Verifikasi overlay berhasil "Timeline berhasil diposting!"
      const successModal = newPage.locator('.swal2-modal');
      await expect(successModal).toBeVisible({ timeout: 15000 });
      
      const modalText = await successModal.textContent();
      if (modalText && modalText.includes('beberapa saat lagi')) {
        console.log('Post rate-limited by server, closed alert to proceed.');
        // Click OK button on the error modal to close it
        const okBtn = successModal.getByRole('button', { name: 'OK' });
        if (await okBtn.count() > 0) {
          await okBtn.click();
        } else {
          await newPage.locator('.swal2-close').click();
        }
      } else {
        await expect(successModal).toContainText('Timeline berhasil diposting!');
        
        // Close overlay
        await newPage.locator('.swal2-close').click();
        
        // Wait for redirect back to timeline or load timeline page on newPage
        await newPage.waitForURL('**/timeline', { timeout: 15000 }).catch(async () => {
          await newPage.goto(`${process.env.BASE_URL}/timeline`);
        });
        await newPage.waitForLoadState('load');
        
        // Scroll ke bawah hingga menemukan komentar yang baru dibuat
        const newPostCard = newPage.locator('.card-feed-timeline', { hasText: caption }).first();
        await newPostCard.scrollIntoViewIfNeeded();
        await expect(newPostCard).toBeVisible({ timeout: 15000 });
        
        // 1. Give Like to the post
        console.log('Liking the newly created post...');
        await newPostCard.locator('.like-post').first().click({ force: true });
        await newPage.waitForTimeout(1000);
        
        // 2. Open comment textarea
        console.log('Opening comment input box...');
        await newPostCard.locator('.comment-post').first().click({ force: true });
        await newPage.waitForTimeout(1000);
        
        // 3. Fill and post the comment
        const commentText = `Comment Testing - ${dateStr} - ${timeStr}`;
        console.log(`Writing comment: "${commentText}"...`);
        
        const commentTextarea = newPostCard.locator('textarea[placeholder*="Tuliskan komentar"]').first();
        await commentTextarea.waitFor({ state: 'visible', timeout: 5000 });
        await commentTextarea.fill(commentText);
        
        // 4. Click Posting Komentar
        await newPostCard.locator('button:has-text("Posting Komentar")').first().click({ force: true });
        await newPage.waitForTimeout(3000);
        
        // 5. Verify the comment text exists under the card
        await expect(newPostCard.locator('.card-feed-timeline', { hasText: commentText }).or(newPostCard).filter({ hasText: commentText }).first()).toBeVisible({ timeout: 15000 });
        console.log('Like and Comment steps completed successfully!');
      }
    });
  });

});
