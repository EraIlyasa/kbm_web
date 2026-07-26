import { Locator, Page } from '@playwright/test';

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
    
    // Specifically target the visible success modal containing congratulations text
    this.successModal = this.page.locator('.modal.show').filter({ hasText: 'Selamat! Cerita kamu telah' });
    this.tutupButton = this.successModal.locator('button:has-text("Tutup")');
  }

  /**
   * Navigates directly to the Writing Studio dashboard.
   */
  public async goto(): Promise<void> {
    await this.page.goto('https://dev-write.ccmhoster.com/');
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
}
