import { test, expect } from '../../fixtures/page.fixture.js';

test.describe('Welcome/Landing Page Specifications', () => {

  test('User can see Masuk and Daftar buttons on the landing page', async ({
    welcomePage,
  }) => {
    // Act & Assert
    await test.step('Navigate to the landing page', async () => {
      await welcomePage.goto();
    });

    await test.step('Verify Masuk and Daftar buttons are visible', async () => {
      await expect(welcomePage.masukButton).toBeVisible();
      await expect(welcomePage.daftarButton).toBeVisible();
    });
  });

});
