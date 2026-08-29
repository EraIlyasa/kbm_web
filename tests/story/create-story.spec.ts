import { test, expect } from '../../fixtures/page.fixture.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { loginAs, getTestAccount } from '../../utils/AuthFlow.js';
import { todayStamp } from '../../utils/DateTimeUtils.js';
import { generateContentBody } from '../../utils/TextUtils.js';
import { requireEnv } from '../../utils/EnvUtils.js';
import * as path from 'path';

test.describe('Writer Studio and Story Creation Specifications', () => {

  test('User should successfully create a new exclusive story and publish 11 chapters', { tag: ['@regression'] }, async ({
    welcomePage,
    loginPage,
    dashboardPage,
    writingPage,
    page,
  }, testInfo) => {
    // Increase test timeout to 7 minutes for writing 11 chapters
    test.setTimeout(420000);

    // Get current account dynamically based on workerIndex
    const account = getTestAccount(testInfo.workerIndex);
    console.log(`Worker #${testInfo.workerIndex} (${testInfo.project.name}) logging in with account: ${account.email}`);

    await test.step('Navigate to the landing page and login', async () => {
      await loginAs({ page, welcomePage, loginPage }, account.email, account.password);
    });

    await test.step('Navigate to Menulis (Writer Studio) portal', async () => {
      // Open the profile dropdown
      await dashboardPage.openProfileMenu();
      // Click on Menulis link in the dropdown menu
      await dashboardPage.profileMenu.menulis.click();
      
      // Wait for redirection to writer studio portal (dynamically based on WRITE_URL env)
      const writeHost = new URL(requireEnv('WRITE_URL')).hostname;
      await page.waitForURL((url) => url.hostname === writeHost, { timeout: Timeouts.NAVIGATION });
      await page.waitForLoadState('load');
      // Wait for client hydration
      await expect(writingPage.ceritaBaruButton).toBeVisible({ timeout: Timeouts.NAVIGATION });
    });

    await test.step('Create a new story with details and cover', async () => {
      // Form fields preparation
      const stamp = todayStamp();
      const loremTitle = "Lorem Ipsum Dolor Si Amet Lorem Ipsum Dolor Si Amet Lorem Ipsum"; // ~60 characters
      const title = `Automation Testing ${loremTitle} - ${stamp}`;
      const synopsis = "Ini adalah sinopsis untuk cerita testing otomasi yang dibuat oleh script Playwright minimal harus 51 karakter.";
      
      await writingPage.createNewStory(
        title,
        'Novel Fantasi',
        synopsis,
        'Automation Testing'
      );
    });

    await test.step('Accept exclusive story agreement terms', async () => {
      // Agreement checkbox may not appear in all environments (e.g. beta)
      await writingPage.agreeCheckbox.waitFor({ state: 'visible', timeout: Timeouts.ACTION }).catch(() => {});
      const isVisible = await writingPage.agreeCheckbox.isVisible();
      if (isVisible) {
        await writingPage.acceptAgreement();
      } else {
        console.log('Agreement checkbox not found, skipping acceptance step.');
      }
    });

    await test.step('Verify eksklusif success dialog and close it', async () => {
      // In some environments (e.g. beta) this modal may not appear
      // Wait for it to become visible first since isVisible() doesn't wait
      await writingPage.successModal.waitFor({ state: 'visible', timeout: Timeouts.RENDER }).catch(() => {});
      
      const isVisible = await writingPage.successModal.isVisible();
      if (isVisible) {
        await expect(writingPage.successModal).toContainText('Selamat! Cerita kamu telah menjadi eksklusif KBM');
        // Click Tutup button to close the modal dialog
        await writingPage.tutupButton.click();
        // Wait for the chapter editor screen to become available
        await expect(writingPage.chapterTitleInput).toBeVisible({ timeout: Timeouts.ACTION });
      } else {
        console.log('Eksklusif success modal not found, skipping — may have gone directly to chapter editor.');
      }
    });

    const logoPath = path.resolve(__dirname, '../../LOGO.png');
    const pdfPath  = path.resolve(__dirname, '../../LOGO.pdf');

    // Content type cycles: bab 1=teks, bab 2=pdf, bab 3=gambar, repeat
    const contentTypes: Array<'text' | 'pdf' | 'image'> = ['text', 'pdf', 'image'];

    // Loop to create chapters 1 to 10
    for (let i = 1; i <= 10; i++) {
      await test.step(`Create and publish Chapter ${i}`, async () => {
        const stamp = todayStamp();
        const chapterTitle = `Bab [${i}] - Automation Test [Lorem Ipsum Dolor Siamet] - [${stamp}]`;
        const bodyContent = generateContentBody(55); // min 50 characters
        const contentType = contentTypes[(i - 1) % 3];
        const filePath = contentType === 'pdf' ? pdfPath : logoPath;

        console.log(`Writing Chapter ${i} (Type: ${contentType}, Title: "${chapterTitle}")...`);
        await writingPage.createAndPublishChapter(chapterTitle, bodyContent, filePath, false, contentType);

        // Wait and then click Tambah Bab on story details screen
        await page.waitForLoadState('load');
        await writingPage.tambahBabButton.scrollIntoViewIfNeeded();
        await writingPage.tambahBabButton.click({ force: true });
        await page.waitForLoadState('load');
        await expect(writingPage.chapterTitleInput).toBeVisible({ timeout: Timeouts.ACTION });
      });
    }

    // Create and publish Chapter 11 (Lock config)
    // Bab 11 → (11 - 1) % 3 = 10 % 3 = 1 → 'pdf'
    await test.step('Create, publish and lock Chapter 11', async () => {
      const stamp = todayStamp();
      const chapterTitle = `Bab [11] - Automation Test [Lorem Ipsum Dolor Siamet] - [${stamp}]`;
      const bodyContent = generateContentBody(1005); // min 1000 characters
      const contentType = contentTypes[(11 - 1) % 3]; // 'pdf'
      const filePath = contentType === 'pdf' ? pdfPath : logoPath;

      console.log(`Writing Chapter 11 (Type: ${contentType}, Title: "${chapterTitle}")...`);
      await writingPage.createAndPublishChapter(chapterTitle, bodyContent, filePath, true, contentType);
    });
  });

});
