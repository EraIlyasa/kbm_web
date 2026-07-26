import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import * as path from 'path';

// Helper function to generate content body with character count constraint
function generateContentBody(minChars: number): string {
  const phrase = 'Automation Test - Lorem Ipsum Dolor Siamet. ';
  const repeat = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ';
  let result = phrase;
  while (result.length < minChars) {
    result += repeat;
  }
  return result;
}

test.describe('Writer Studio and Story Creation Specifications', () => {

  test('User should successfully create a new exclusive story and publish 11 chapters', async ({
    welcomePage,
    loginPage,
    dashboardPage,
    writingPage,
    page,
  }, testInfo) => {
    // Increase test timeout to 7 minutes for writing 11 chapters
    test.setTimeout(420000);

    // Skip Chromium and WebKit because headless browsers are blocked by reCAPTCHA v2 on staging login
    test.skip(
      testInfo.project.name === 'chromium' || testInfo.project.name === 'webkit',
      'Headless Chromium/WebKit is blocked by reCAPTCHA v2'
    );

    // Get current account dynamically based on workerIndex
    const account = Credentials.TEST_ACCOUNTS[testInfo.workerIndex % Credentials.TEST_ACCOUNTS.length];
    console.log(`Worker #${testInfo.workerIndex} (${testInfo.project.name}) logging in with account: ${account.email}`);

    await test.step('Navigate to the landing page and login', async () => {
      await welcomePage.goto();
      await welcomePage.masukButton.click();
      await loginPage.login(account.email, account.password);
      await page.waitForURL(`${process.env.BASE_URL}/`, { timeout: 30000 });
      await page.waitForLoadState('load');
    });

    await test.step('Navigate to Menulis (Writer Studio) portal', async () => {
      // Hover profile trigger to show dropdown
      await dashboardPage.profileTrigger.hover({ timeout: 15000 });
      // Click on Menulis link in the dropdown menu
      await dashboardPage.profileMenu.menulis.click();
      
      // Wait for redirection to writer studio portal (dynamically based on WRITE_URL env)
      const writeHost = new URL(process.env.WRITE_URL || 'https://dev-write.ccmhoster.com').hostname;
      await page.waitForURL(new RegExp(`.*${writeHost.replace('.', '\\.')}.*`), { timeout: 30000 });
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
      // Agreement checkbox may not appear in all environments (e.g. beta)
      await writingPage.agreeCheckbox.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
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
      await writingPage.successModal.waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
      
      const isVisible = await writingPage.successModal.isVisible();
      if (isVisible) {
        await expect(writingPage.successModal).toContainText('Selamat! Cerita kamu telah menjadi eksklusif KBM');
        // Click Tutup button to close the modal dialog
        await writingPage.tutupButton.click();
        await page.waitForTimeout(2000);
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
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        const chapterTitle = `Bab [${i}] - Automation Test [Lorem Ipsum Dolor Siamet] - [${dateStr}] - [${timeStr}]`;
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
        await page.waitForTimeout(2000);
      });
    }

    // Create and publish Chapter 11 (Lock config)
    // Bab 11 → index 10 → contentTypes[10 % 3] = contentTypes[1] = 'pdf'
    await test.step('Create, publish and lock Chapter 11', async () => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
      const chapterTitle = `Bab [11] - Automation Test [Lorem Ipsum Dolor Siamet] - [${dateStr}] - [${timeStr}]`;
      const bodyContent = generateContentBody(1005); // min 1000 characters
      const contentType = contentTypes[10 % 3]; // 'pdf'
      const filePath = contentType === 'pdf' ? pdfPath : logoPath;

      console.log(`Writing Chapter 11 (Type: ${contentType}, Title: "${chapterTitle}")...`);
      await writingPage.createAndPublishChapter(chapterTitle, bodyContent, filePath, true, contentType);
    });
  });

});
