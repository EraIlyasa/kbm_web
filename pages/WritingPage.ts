import { Locator, Page, expect } from '@playwright/test';

export class WritingPage {
  public readonly ceritaBaruButton: Locator;
  public readonly titleInput: Locator;
  public readonly categoryInput: Locator;
  public readonly synopsisTextarea: Locator;
  public readonly keywordsInput: Locator;
  public readonly editCoverButton: Locator;
  public readonly kbmSampulOption: Locator;
  public readonly firstCoverImage: Locator;
  public readonly selanjutnyaButton: Locator;
  
  // Agreement screen
  public readonly agreeCheckbox: Locator;
  public readonly bersediaButton: Locator;
  
  // Success popup modal
  public readonly successModal: Locator;
  public readonly tutupButton: Locator;

  // Chapter Creation Form Locators
  public readonly chapterTitleInput: Locator;
  public readonly chapterEditor: Locator;
  public readonly tekstTabButton: Locator;
  public readonly pdfTabButton: Locator;
  public readonly gambarTabButton: Locator;
  public readonly terbitkanButton: Locator;
  public readonly fileInput: Locator;
  public readonly pdfFileInput: Locator;
  
  // Warning/Success Modals
  public readonly warningModal: Locator;
  public readonly warningOkButton: Locator;
  public readonly berhasilModal: Locator;
  public readonly berhasilOkButton: Locator;
  
  // Locking confirmation modal
  public readonly lockPopup: Locator;
  public readonly lockYaButton: Locator;
  public readonly lockBatalButton: Locator;
  
  // Lock Configuration screen elements
  public readonly coinKeduanyaOption: Locator;
  public readonly nominalInput: Locator;
  public readonly simpanConfigButton: Locator;
  
  // Chapter list detail screen
  public readonly tambahBabButton: Locator;

  constructor(private readonly page: Page) {
    this.ceritaBaruButton = this.page.getByRole('button', { name: 'Cerita Baru' })
      .or(this.page.locator('.btn-primary', { hasText: 'Cerita Baru' }));
    
    this.titleInput = this.page.locator('input[name="title"]');
    this.categoryInput = this.page.locator('#react-select-2-input');
    this.synopsisTextarea = this.page.locator('textarea[name="synopsis"]');
    this.keywordsInput = this.page.locator('input[placeholder="Tulis kata kunci dan klik ENTER"]');
    
    this.editCoverButton = this.page.locator('button:has-text("Edit Cover")');
    this.kbmSampulOption = this.page.locator('.dropdown-item:has-text("Kbm Sampul")');
    this.firstCoverImage = this.page.locator('.modal-body img').first();
    this.selanjutnyaButton = this.page.locator('button:has-text("Selanjutnya")');
    
    this.agreeCheckbox = this.page.locator('input#agree');
    this.bersediaButton = this.page.locator('button:has-text("Bersedia")');
    
    // Success popup modal
    this.successModal = this.page.locator('.modal.show, .modal, [role="dialog"], dialog').filter({ hasText: 'Selamat! Cerita kamu telah' });
    this.tutupButton = this.successModal.locator('button:has-text("Tutup")');

    // Chapter form page
    this.chapterTitleInput = this.page.getByPlaceholder('Tulis judul bab');
    this.chapterEditor = this.page.locator('.ql-editor');
    // Use same filter pattern as gambarTabButton since it's proven to work
    this.tekstTabButton = this.page.locator('div, span, a, button').filter({ hasText: /^Teks$/ }).first();
    this.pdfTabButton = this.page.locator('div, span, a, button').filter({ hasText: /^PDF$/ }).first();
    this.gambarTabButton = this.page.locator('div, span, a, button').filter({ hasText: /^Gambar$/ }).first();
    this.terbitkanButton = this.page.locator('button:has-text("Terbitkan")');
    this.fileInput = this.page.locator('input[type="file"]').first();
    this.pdfFileInput = this.page.locator('input[type="file"][accept*="pdf"], input[type="file"]').first();
    
    // Warning modal "Gambar wajib diisi!"
    this.warningModal = this.page.locator('.swal2-modal, .modal.show, div[role="dialog"], .Toastify__toast, .Toastify__toast-body').filter({ hasText: 'Gambar wajib diisi!' });
    this.warningOkButton = this.warningModal.locator('button:has-text("OK"), button:has-text("Tutup"), button:has-text("Batal"), .swal2-confirm').first();
    
    // Success modal "Berhasil"
    this.berhasilModal = this.page.locator('.swal2-modal, .modal.show, div[role="dialog"], .Toastify__toast, .Toastify__toast-body').filter({ hasText: 'Berhasil' });
    this.berhasilOkButton = this.berhasilModal.locator('button:has-text("OK"), button:has-text("Tutup"), .swal2-confirm').first();
    
    // Lock dialog
    this.lockPopup = this.page.locator('.modal.show, div[role="dialog"], dialog').filter({ hasText: 'Apakah Anda ingin mengunci bab ini?' });
    this.lockYaButton = this.lockPopup.locator('button:has-text("Ya")');
    this.lockBatalButton = this.lockPopup.locator('button:has-text("Batal")');
    
    // Lock configuration screen
    this.coinKeduanyaOption = this.page.locator('button:has-text("Keduanya"), label:has-text("Keduanya"), input[value="both"]');
    this.nominalInput = this.page.locator('input[type="number"], input[name="nominal"], input[placeholder*="nominal"]');
    this.simpanConfigButton = this.page.locator('button:has-text("Simpan"), .btn:has-text("Simpan")');
    
    // Chapter List "Tambah Bab"
    this.tambahBabButton = this.page.locator('button:has-text("Tambah Bab"), a:has-text("Tambah Bab"), .btn:has-text("Tambah Bab")');
  }

  /**
   * Navigates directly to the Writing Studio dashboard.
   */
  public async goto(): Promise<void> {
    await this.page.goto(process.env.WRITE_URL || 'https://dev-write.ccmhoster.com/');
  }

  /**
   * Creates a new story.
   */
  public async createNewStory(title: string, category: string, synopsis: string, keyword: string): Promise<void> {
    // Dismiss startup profit-sharing agreement modal if present
    const agreeAndContinueBtn = this.page.locator('button:has-text("Saya Setuju & Lanjutkan")');
    if (await agreeAndContinueBtn.count() > 0 && await agreeAndContinueBtn.isVisible()) {
      console.log('Dismissing profit sharing modal...');
      await agreeAndContinueBtn.click();
      await this.page.waitForTimeout(2000);
    }

    await this.ceritaBaruButton.click();
    await this.page.waitForLoadState('load');
    
    // Fill title
    await this.titleInput.fill(title);
    
    // Fill category and click the dropdown option
    await this.categoryInput.fill(category);
    const categoryOption = this.page.locator('div[id*="-listbox"] div, div[id*="-option-"], div[class*="-menu"] div').filter({ hasText: new RegExp(`^${category}$`) }).first();
    await categoryOption.waitFor({ state: 'visible', timeout: 5000 });
    await categoryOption.click();
    
    // Fill synopsis
    await this.synopsisTextarea.fill(synopsis);
    
    // Fill keywords
    await this.keywordsInput.fill(keyword);
    await this.page.keyboard.press('Enter');
    
    // Select cover
    await this.editCoverButton.click();
    await this.kbmSampulOption.click();
    await this.page.waitForTimeout(2000); // Wait for modal fade-in
    await this.firstCoverImage.click();
    
    // Click Selanjutnya
    await this.selanjutnyaButton.click();
  }

  /**
   * Accepts the exclusive story agreement.
   */
  public async acceptAgreement(): Promise<void> {
    await this.agreeCheckbox.click();
    await this.bersediaButton.click();
  }

  /**
   * Fills out a chapter with one of three content types and publishes it.
   * contentType: 'text' = teks editor only
   *              'pdf'  = switch to PDF tab and upload a PDF file
   *              'image'= switch to Gambar tab, trigger warning, then upload image
   */
  public async createAndPublishChapter(
    title: string,
    bodyText: string,
    filePath: string,
    shouldLock: boolean,
    contentType: 'text' | 'pdf' | 'image' = 'image'
  ): Promise<void> {

    // 1. Fill Title
    await this.chapterTitleInput.fill(title);
    await this.page.waitForTimeout(500);

    if (contentType === 'text') {
      // --- TEXT ONLY ---
      // Teks tab is active by default, no need to click it.
      // Wait for the editor to be ready, then fill content.
      await this.chapterEditor.waitFor({ state: 'visible', timeout: 15000 });
      await this.chapterEditor.fill(bodyText);
      await this.page.waitForTimeout(1000);

      // Wait for any Toastify toast to disappear, then click Terbitkan
      await this.page.waitForTimeout(1500);
      await this.terbitkanButton.click({ force: true });

    } else if (contentType === 'pdf') {
      // --- PDF ONLY ---
      // 2. Switch to PDF tab
      await this.pdfTabButton.click({ force: true });
      await this.page.waitForTimeout(1000);

      // 3. Upload the PDF file
      await this.pdfFileInput.setInputFiles(filePath);
      await this.page.waitForTimeout(5000); // wait for upload

      // 4. Wait for any Toastify toast to disappear, then click Terbitkan
      await this.page.waitForTimeout(1500);
      await this.terbitkanButton.click({ force: true });

    } else {
      // --- IMAGE (default) ---
      // 2. Fill editor content
      await this.chapterEditor.fill(bodyText);
      await this.page.waitForTimeout(1000);

      // 3. Switch to Gambar tab
      await this.gambarTabButton.click({ force: true });
      await this.page.waitForTimeout(1000);

      // 4. Click Terbitkan to trigger validation warning
      await this.terbitkanButton.click({ force: true });

      // 5. Verify the warning popup dialog
      await expect(this.warningModal.first()).toBeVisible({ timeout: 15000 });
      const modalText = await this.warningModal.first().innerText();
      expect(modalText).toContain('Gambar wajib diisi!');

      // 6. Dismiss the warning modal if confirm button is visible
      if (await this.warningOkButton.count() > 0 && await this.warningOkButton.isVisible()) {
        await this.warningOkButton.click({ force: true });
        await this.page.waitForTimeout(1000);
      }

      // 7. Upload image file
      await this.fileInput.setInputFiles(filePath);
      await this.page.waitForTimeout(5000); // wait for image upload to complete

      // 8. Wait for Toastify toast to disappear before clicking Terbitkan
      await this.page.locator('.Toastify__toast').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      await this.page.waitForTimeout(500);
      await this.terbitkanButton.click({ force: true });
    }

    // 9. Verify success dialog (optional)
    const hasBerhasilModal = await this.berhasilModal.first().isVisible({ timeout: 5000 }).catch(() => false);
    if (hasBerhasilModal) {
      if (await this.berhasilOkButton.count() > 0 && await this.berhasilOkButton.isVisible()) {
        await this.berhasilOkButton.click({ force: true });
        await this.page.waitForTimeout(1000);
      }
    }

    // 10. Verify lock confirmation dialog
    await expect(this.lockPopup.first()).toBeVisible({ timeout: 15000 });

    // 11. Handle locking configuration
    if (shouldLock) {
      await this.lockYaButton.click();
      await this.page.waitForTimeout(2000); // wait for locking config overlay

      // Click Keduanya
      await this.coinKeduanyaOption.first().click({ force: true });

      // Set nominal 15
      await this.nominalInput.fill('15');
      await this.page.waitForTimeout(5000);

      // Click Simpan
      await this.simpanConfigButton.click({ force: true });
      await this.page.waitForTimeout(2000);

      // If there is another swal2-confirm after saving pricing settings, confirm it
      const finalOk = this.page.locator('.swal2-confirm, button:has-text("OK"), button:has-text("Simpan")').first();
      if (await finalOk.count() > 0) {
        await finalOk.click({ force: true });
      }
      await this.page.waitForTimeout(2000);
    } else {
      await this.lockBatalButton.click();
      await this.page.waitForTimeout(2000);
    }
  }
}
