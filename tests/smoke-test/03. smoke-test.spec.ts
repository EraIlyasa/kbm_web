import { test, expect } from '../../fixtures/page.fixture.js';
import { Credentials } from '../../constants/Credentials.js';
import { RegisterAccounts } from '../../constants/RegisterAccounts.js';
import { Timeouts } from '../../constants/Timeouts.js';
import { ReturnAllApi } from '../../api/ReturnAllApi.js';

// This file contains ALL register scenarios: testing-1 (the original scenario
// using Credentials.REGISTER_ACCOUNT) plus testing-2 through testing-25 generated
// from constants/RegisterAccounts. Because every test lives in this single file,
// Playwright runs them serially on one worker, which satisfies the dev server
// requirement that registrations must never run concurrently.

test.describe('Register Link Specifications', () => {

  test('User should be able to register a new account after resetting the email', { tag: ['@smoke', '@regression'] }, async ({
    loginPage,
    registerPage,
    page,
    request,
  }) => {
    // Live-site flow: reset the registered email via API -> login page -> click
    // "Daftar di sini" -> fill the registration form -> submit -> verify the
    // account was created successfully.
    test.setTimeout(60000);

    // 0. Reset the registered email via the ReturnAll API so the registration
    //    flow starts from a clean state. This makes the scenario idempotent:
    //    each run removes the previously registered account before re-registering it.
    const returnAllApi = new ReturnAllApi(request);
    const resetResponse = await returnAllApi.resetRegisteredEmail();
    expect(resetResponse.ok()).toBeTruthy();

    // 1. Navigate to the login page
    await loginPage.goto();

    // 2. Click the "Daftar di sini" hyperlink and wait for the register page
    await loginPage.registerLink.click();
    await page.waitForURL('**/register', { timeout: Timeouts.PAGE_LOAD });

    // 3. Fill email, password and password confirmation.
    await registerPage.fillRegisterForm(
      Credentials.REGISTER_ACCOUNT.email,
      Credentials.REGISTER_ACCOUNT.password,
    );

    // 4. Click the "Daftar" submit button.
    await registerPage.submit();

    // 5. A successful registration redirects to /email-sent and shows a Bootstrap
    //    success alert ("Info! Register berhasil"). The alert auto-dismisses after
    //    a few seconds, so wait for the redirect and the alert concurrently.
    await Promise.all([
      page.waitForURL('**/email-sent', { timeout: Timeouts.RENDER }),
      expect(page.getByRole('alert')).toContainText('Info! Register berhasil', { timeout: Timeouts.RENDER }),
    ]);
  });

  // testing-2 through testing-25: generated from RegisterAccounts. Tests within a
  // single file are run serially by a single worker, so no extra serialization
  // config is needed. The '@register' tag allows filtering with --grep @register.
  for (const { email, password } of Object.values(RegisterAccounts)) {
    test(`User should be able to register a new account (${email}) after resetting the email`, { tag: ['@smoke', '@regression', '@register'] }, async ({
      loginPage,
      registerPage,
      page,
      request,
    }) => {
      // Live-site flow: reset the registered email via API -> login page -> click
      // "Daftar di sini" -> fill the registration form -> submit -> verify the
      // account was created successfully.
      test.setTimeout(60000);

      // 0. Reset the registered email via the ReturnAll API so the registration
      //    flow starts from a clean state. This makes the scenario idempotent:
      //    each run removes the previously registered account before re-registering it.
      const returnAllApi = new ReturnAllApi(request);
      const resetResponse = await returnAllApi.resetRegisteredEmail();
      expect(resetResponse.ok()).toBeTruthy();

      // 1. Navigate to the login page
      await loginPage.goto();

      // 2. Click the "Daftar di sini" hyperlink and wait for the register page
      await loginPage.registerLink.click();
      await page.waitForURL('**/register', { timeout: Timeouts.PAGE_LOAD });

      // 3. Fill email, password and password confirmation.
      await registerPage.fillRegisterForm(email, password);

      // 4. Click the "Daftar" submit button.
      await registerPage.submit();

      // 5. A successful registration redirects to /email-sent and shows a Bootstrap
      //    success alert ("Info! Register berhasil"). The alert auto-dismisses after
      //    a few seconds, so wait for the redirect and the alert concurrently.
      await Promise.all([
        page.waitForURL('**/email-sent', { timeout: Timeouts.RENDER }),
        expect(page.getByRole('alert')).toContainText('Info! Register berhasil', { timeout: Timeouts.RENDER }),
      ]);
    });
  }
});
