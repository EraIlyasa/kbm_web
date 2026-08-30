import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { TimelinePage } from '../../pages/TimelinePage.js';
import { loginAs, getTestAccount } from '../../utils/AuthFlow.js';
import { todayStamp } from '../../utils/DateTimeUtils.js';
import * as path from 'path';

test.describe('Real Authentication and Landing Menu Specifications', () => {

  test('User should login with real credentials and verify landing menu elements', { tag: ['@smoke', '@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    settingsPage,
    timelinePage,
    profilePage,
    page,
  }, testInfo) => {
    // Allow up to 3 minutes for real website logins, timeline posts and settings updates
    test.setTimeout(180000);

    // Get current account dynamically based on workerIndex
    const account = getTestAccount(testInfo.workerIndex);
    console.log(`Worker #${testInfo.workerIndex} (${testInfo.project.name}) logging in with account: ${account.email}`);

    // Act
    await test.step('Navigate to the landing page and login', async () => {
      await loginAs({ page, welcomePage, loginPage }, account.email, account.password);
    });

    // Assert
    await test.step('Verify Topup button appears after successful login', async () => {
      await expect(dashboardPage.topupButton).toBeVisible({ timeout: Timeouts.RENDER });
    });

    await test.step('Hover profile trigger and verify all menu items appear', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();

      // Verify visibility of all submenu options
      await expect(dashboardPage.profileMenu.misiHarian).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.profile).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.menulis).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.daftarBuku).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.bacaanSaya).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.timeline).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.editBank).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.pengaturan).toBeVisible({ timeout: Timeouts.ACTION });
      await expect(dashboardPage.profileMenu.keluar).toBeVisible({ timeout: Timeouts.ACTION });
    });

    await test.step('Navigate to Bacaan Saya and verify screen', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      // Click on Bacaan Saya link
      await dashboardPage.profileMenu.bacaanSaya.click();
      await page.waitForURL('**/bacaan-saya', { timeout: Timeouts.PAGE_LOAD });
      await page.waitForLoadState('load');
      // Verify Bacaan Saya screen content
      await expect(page.getByText('Bacaan Saya', { exact: true }).filter({ visible: true }).first()).toBeVisible();
    });

    await test.step('Navigate to Daftar Buku and verify screen', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      // Click on Daftar Buku link
      await dashboardPage.profileMenu.daftarBuku.click();
      await page.waitForURL('**/daftar-buku', { timeout: Timeouts.PAGE_LOAD });
      await page.waitForLoadState('load');
      // Verify Daftar Buku screen content
      await expect(page.getByText('Daftar Buku', { exact: true }).filter({ visible: true }).first()).toBeVisible();
    });

    await test.step('Navigate to Profile, update bio to short version and then back to full version', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      // Click on Profile link
      await dashboardPage.profileMenu.profile.click();
      await page.waitForURL('**/profile-user', { timeout: Timeouts.PAGE_LOAD });
      await page.waitForLoadState('load');
      
      // Verify account email
      await expect(profilePage.fullNameInput).toHaveValue(account.email, { timeout: Timeouts.ACTION });
      
      // Scroll down and change bio to "Full Stack Software Quality Assurance"
      await profilePage.updateBio('Full Stack Software Quality Assurance');
      
      // Verify confirm dialog and agree
      await expect(profilePage.confirmDialog).toBeVisible({ timeout: Timeouts.ACTION });
      await profilePage.confirmChanges();
      
      // Verify success notification toast
      await expect(profilePage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: Timeouts.ACTION });
      
      // Scroll down and change bio back to "Full Stack Software Quality Assurance Engineer"
      await profilePage.updateBio('Full Stack Software Quality Assurance Engineer');
      
      // Verify confirm dialog and agree
      await expect(profilePage.confirmDialog).toBeVisible({ timeout: Timeouts.ACTION });
      await profilePage.confirmChanges();
      
      // Verify success notification toast
      await expect(profilePage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: Timeouts.ACTION });
    });

    await test.step('Navigate to Pengaturan (Settings) page', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      // Click on Pengaturan link in the dropdown menu
      await dashboardPage.profileMenu.pengaturan.click();
      await page.waitForURL('**/pengaturan', { timeout: Timeouts.PAGE_LOAD });
      await page.waitForLoadState('load');
    });

    await test.step('Change occupation to Buruh Pabrik and verify confirmation dialog & success notification', async () => {
      // Change occupation from current (starts as Masinis) to Buruh Pabrik
      await settingsPage.updateOccupation('Buruh Pabrik');

      // Verify the SweetAlert "Informasi" dialog appears
      await expect(settingsPage.confirmDialog).toBeVisible({ timeout: Timeouts.ACTION });
      
      // Click Setuju to confirm
      await settingsPage.confirmChanges();

      // Verify success toast notification appears immediately
      await expect(settingsPage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: Timeouts.EXPECT });
    });

    await test.step('Change occupation back to Masinis and verify confirmation dialog & success notification', async () => {
      // Change occupation from Buruh Pabrik back to Masinis
      await settingsPage.updateOccupation('Masinis');

      // Verify the SweetAlert "Informasi" dialog appears
      await expect(settingsPage.confirmDialog).toBeVisible({ timeout: Timeouts.ACTION });
      
      // Click Setuju to confirm
      await settingsPage.confirmChanges();

      // Verify success toast notification appears immediately
      await expect(settingsPage.successNotification).toContainText('Info! Berhasil memperbaharui profil', { timeout: Timeouts.EXPECT });
    });

    await test.step('Open Profile dropdown and click Timeline', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      
      // Click on Timeline link in the dropdown menu
      await dashboardPage.profileMenu.timeline.click();
      await page.waitForURL('**/timeline', { timeout: Timeouts.PAGE_LOAD });
      await page.waitForLoadState('load');
    });

    await test.step('Click timeline trigger and handle new tab posting', async () => {
      const [newPage] = await Promise.all([
        page.context().waitForEvent('page'),
        timelinePage.inputTimelineTrigger.click(),
      ]);
      await newPage.waitForLoadState('load');

      const stamp = todayStamp();
      const caption = `Ini Testing-${stamp}`;
      const timeline = new TimelinePage(newPage);
      const filePath = path.resolve(__dirname, '../../LOGO.png');

      // Post the timeline entry
      await timeline.postTimeline(caption, filePath);

      // The app either shows a success/rate-limit SweetAlert modal, or redirects
      // directly to the feed. Wait for whichever appears first.
      await Promise.race([
        timeline.successModal.waitFor({ state: 'visible', timeout: Timeouts.RENDER }).catch(() => {}),
        newPage.waitForURL('**/timeline', { timeout: Timeouts.RENDER }).catch(() => {}),
      ]);

      // Dismiss the posting modal if it appears (it may show up just before or
      // right after the redirect). Returns true when the post was rate-limited.
      const dismissPostingModal = async (): Promise<boolean> => {
        try {
          await timeline.successModal.waitFor({ state: 'visible', timeout: Timeouts.ACTION });
        } catch {
          // No modal appeared; nothing to dismiss.
          return false;
        }
        const modalText = (await timeline.successModal.textContent()) ?? '';
        if (modalText.includes('beberapa saat lagi')) {
          console.warn('Post rate-limited by server; timeline post/like/comment were NOT verified.');
          const okBtn = timeline.successModal.getByRole('button', { name: 'OK' });
          if ((await okBtn.count()) > 0) {
            await okBtn.click();
          } else {
            await timeline.closeModalButton.click().catch(() => {});
          }
          return true;
        }
        await expect(timeline.successModal).toContainText('Timeline berhasil diposting!');
        const okBtn = timeline.successModal.getByRole('button', { name: 'OK' });
        if ((await okBtn.count()) > 0) {
          await okBtn.click();
        } else {
          await timeline.closeModalButton.click().catch(() => {});
        }
        await timeline.successModal.waitFor({ state: 'detached', timeout: Timeouts.SHORT }).catch(() => {});
        return false;
      };

      if (await dismissPostingModal()) return;

      // Make sure we are on the timeline feed.
      if (!newPage.url().includes('/timeline')) {
        await newPage.goto('/timeline');
      }
      await newPage.waitForLoadState('load');

      // Verify the newly created post and interact with it
      const newPostCard = timeline.getPostByCaption(caption).first();
      await newPostCard.scrollIntoViewIfNeeded();
      await expect(newPostCard).toBeVisible({ timeout: Timeouts.RENDER });

      // A late modal may appear after the feed settles; dismiss it before interacting.
      if (await timeline.successModal.isVisible().catch(() => false)) {
        if (await dismissPostingModal()) return;
      }

      console.log('Liking the newly created post...');
      await timeline.likePost(newPostCard);

      const commentText = `Comment Testing - ${stamp}`;
      console.log(`Writing comment: "${commentText}"...`);
      await timeline.addComment(newPostCard, commentText);

      await expect(newPostCard.getByText(commentText).first()).toBeVisible({ timeout: Timeouts.ACTION });
      console.log('Like and Comment steps completed successfully!');
    });
  });

});
