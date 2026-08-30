import { test, expect } from '../../fixtures/page.fixture.js';
import { loginAsTestUser } from '../../utils/AuthFlow.js';

test.describe('Category Specifications', () => {
  // Representative subset of book categories expected in the dropdown
  const visibleCategories = [
    'Agama',
    'Akuntansi',
    'Bahasa',
    'Bisnis',
    'Cerita Rakyat',
    'Dongeng',
    'Ekonomi',
    'Hukum',
    'Teknologi',
  ];

  test(
    'User should see book categories on the category dropdown',
    { tag: ['@category', '@regression'] },
    async ({ page, welcomePage, loginPage, categoryPage }, testInfo) => {
      test.setTimeout(120000);

      await test.step('Navigate to the landing page and login', async () => {
        await loginAsTestUser({ page, welcomePage, loginPage }, testInfo.workerIndex);
      });

      await test.step('Open the category dropdown next to the book search field', async () => {
        await categoryPage.openCategoryDropdown();
      });

      await test.step('Verify the category list is populated', async () => {
        const count = await categoryPage.getCategoryCount();
        expect(count).toBeGreaterThanOrEqual(visibleCategories.length);
      });

      await test.step('Verify the expected categories are displayed', async () => {
        for (const name of visibleCategories) {
          await test.step(`Verify category "${name}" is visible`, async () => {
            await categoryPage.hasCategory(name);
          });
        }
      });
    }
  );
});
