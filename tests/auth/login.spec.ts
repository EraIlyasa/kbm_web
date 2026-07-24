import { test, expect } from '../../fixtures/page.fixture.js';
import { UserBuilder } from '../../builders/UserBuilder.js';

test.describe('Authentication Specifications', () => {
  
  test('User with valid credentials should login successfully and see the dashboard', async ({
    loginPage,
    dashboardPage,
    page,
  }) => {
    // Arrange
    const validUser = UserBuilder.admin().build();

    // Act
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Submit valid login credentials', async () => {
      await loginPage.login(validUser.email, validUser.password);
    });

    // Assert
    await test.step('Verify redirection to Dashboard and correct heading displays', async () => {
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(dashboardPage.title).toHaveText('Dashboard');
    });

    await test.step('Verify composed header displays correct profile name', async () => {
      const profileName = await dashboardPage.navbar.getProfileName();
      expect(profileName).toBe('Admin User');
    });
  });

  test('User with invalid credentials should see error notification', async ({
    loginPage,
    page,
  }) => {
    // Arrange
    const invalidUser = UserBuilder.admin()
      .withPassword('wrongPassword')
      .build();

    // Act
    await test.step('Navigate to login page', async () => {
      await loginPage.goto();
    });

    await test.step('Submit invalid login credentials', async () => {
      await loginPage.login(invalidUser.email, invalidUser.password);
    });

    // Assert
    await test.step('Verify error message alert contains expected validation text', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
    });
  });

});
