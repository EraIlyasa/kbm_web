import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { DashboardPage } from '../pages/DashboardPage.js';
import { WelcomePage } from '../pages/WelcomePage.js';
import { AuthApi } from '../api/AuthApi.js';
import { URLs } from '../constants/URLs.js';

// Extend base Playwright test type to include custom fixtures
export type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  welcomePage: WelcomePage;
  authApi: AuthApi;
};

export const test = base.extend<CustomFixtures>({
  // Configure page fixture to automatically set up mock routes before tests execute
  page: async ({ page }, use) => {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@company.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminPassword123';

    // Mock Login UI
    await page.route('**/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Login</title>
            <style>
              body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #fafafa; margin: 0; }
              .card { background: white; padding: 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 320px; }
              .field { margin-bottom: 16px; }
              label { display: block; margin-bottom: 6px; font-weight: 600; color: #333; }
              input { width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
              button { width: 100%; padding: 10px; background: #0070f3; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
              button:hover { background: #0051cb; }
              .alert { color: #d32f2f; margin-top: 12px; display: none; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="card">
              <form id="loginForm">
                <div class="field">
                  <label for="email">Email</label>
                  <input type="email" id="email" required />
                </div>
                <div class="field">
                  <label for="password">Password</label>
                  <input type="password" id="password" required />
                </div>
                <button type="submit">Login</button>
                <div id="error" class="alert" role="alert"></div>
              </form>
            </div>
            <script>
              document.getElementById('loginForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const errorDiv = document.getElementById('error');
                errorDiv.style.display = 'none';

                const res = await fetch('/api/auth/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password })
                });

                if (res.ok) {
                  window.location.href = '/dashboard';
                } else {
                  const data = await res.json();
                  errorDiv.textContent = data.message || 'Login failed';
                  errorDiv.style.display = 'block';
                }
              });
            </script>
          </body>
          </html>
        `,
      });
    });

    // Mock Dashboard UI
    await page.route('**/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Dashboard</title>
            <style>
              body { font-family: sans-serif; margin: 0; display: flex; height: 100vh; background: #fafafa; }
              header { background: #1e1e1e; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; width: 100%; box-sizing: border-box; }
              nav { width: 240px; background: #f0f2f5; height: 100%; padding: 24px 16px; box-sizing: border-box; border-right: 1px solid #e3e8ee; }
              nav h3 { margin-top: 0; color: #4a5568; }
              nav a { display: block; padding: 8px 12px; margin-bottom: 8px; color: #2d3748; text-decoration: none; border-radius: 4px; }
              nav a:hover { background: #e2e8f0; }
              main { padding: 32px; flex-grow: 1; box-sizing: border-box; }
              table { width: 100%; border-collapse: collapse; margin-top: 24px; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
              th, td { border: 1px solid #e3e8ee; padding: 12px 16px; text-align: left; }
              th { background-color: #f7fafc; color: #4a5568; font-weight: 600; }
              button.logout-btn { padding: 6px 12px; background: #e53e3e; color: white; border: none; border-radius: 4px; cursor: pointer; }
              button.logout-btn:hover { background: #c53030; }
            </style>
          </head>
          <body>
            <nav aria-label="Sidebar Navigation">
              <h3>Navigation</h3>
              <a href="/dashboard">Dashboard</a>
              <a href="/inventory">Inventory</a>
            </nav>
            <div style="flex-grow: 1; display: flex; flex-direction: column; height: 100%;">
              <header role="navigation" aria-label="Main Navigation">
                <span>Enterprise Portal</span>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <span data-testid="profile-name">Admin User</span>
                  <button class="logout-btn">Logout</button>
                </div>
              </header>
              <main>
                <h1 aria-label="Dashboard">Dashboard</h1>
                <table aria-label="Products List">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Widget A</td>
                      <td>WID-A-01</td>
                      <td>$10.00</td>
                    </tr>
                  </tbody>
                </table>
              </main>
            </div>
            <script>
              document.querySelector('.logout-btn').addEventListener('click', () => {
                window.location.href = '/login';
              });
            </script>
          </body>
          </html>
        `,
      });
    });

    // Mock API Authenticate Login
    await page.route('**/api/auth/login', async (route) => {
      if (route.request().method() !== 'POST') {
        return await route.continue();
      }

      const payload = JSON.parse(route.request().postData() || '{}');
      if (payload.email === adminEmail && payload.password === adminPassword) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ token: 'mock-jwt-token-123', status: 'SUCCESS' }),
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Invalid email or password', status: 'FAILURE' }),
        });
      }
    });

    // Run the test with the prepared page context
    await use(page);
  },

  // Instantiate LoginPage POM via DI
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  // Instantiate DashboardPage POM via DI
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Instantiate WelcomePage POM via DI
  welcomePage: async ({ page }, use) => {
    await use(new WelcomePage(page));
  },

  // Instantiate AuthApi client via DI
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
});

export { expect } from '@playwright/test';
