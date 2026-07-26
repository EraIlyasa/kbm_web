# Enterprise Playwright Automation Framework

This is a TypeScript-based, enterprise-grade Playwright automation framework designed following the strict guidelines of the Engineering Handbook.

## Folder Structure

```text
├── playwright.config.ts        # Central config (Single Source of Truth)
├── tsconfig.json               # TypeScript strict mode settings
├── package.json                # Project dependencies and script commands
├── .env                        # Environment secrets (ignored by Git)
├── .env.example                # Template for environment secrets
│
├── tests/                      # Business scenarios (No locators or assertions in page objects)
│   └── auth/
│
├── pages/                      # Page Object Model files (Stateless, action-oriented, no assertions)
│
├── components/                 # Component Object Model files (Shared UI components)
│
├── fixtures/                   # Custom fixtures and dependency injection (Mock interceptors)
│
├── api/                        # Domain-specific API clients
│
├── builders/                   # Builders pattern for dynamic test data
│
├── constants/                  # Unified constants (Roles, URLs, Timeouts)
│
├── utils/                      # Framework-independent pure function utilities
│
└── models/                     # TypeScript interfaces describing business entities
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Running the Tests:
   * **Headless Mode (Default/Background)**:
     ```bash
     npx playwright test
     ```
     atau
     ```bash
     npm run test
     ```
   * **Running Specific Spec Files**:
     Untuk menjalankan file tes tertentu secara spesifik:
     ```bash
     # Menjalankan test authentication & profile saja
     npx playwright test tests/auth/login-real.spec.ts

     # Menjalankan test pembuatan cerita & 11 bab saja
     npx playwright test tests/story/create-story.spec.ts
     ```
   * **Running in a Specific Environment (dev / beta)**:
     Gunakan variable `ENV` sebelum command running test:
     ```bash
     # Jalankan di environment DEV (Default, memuat .env)
     npx playwright test tests/auth/login-real.spec.ts

     # Jalankan di environment BETA (Memuat .env.beta)
     ENV=beta npx playwright test tests/auth/login-real.spec.ts
     ```
   * **Running on a Specific Browser/Project**:
     Gunakan parameter `--project`:
     ```bash
     # Hanya jalankan di browser Firefox
     npx playwright test tests/auth/login-real.spec.ts --project=firefox

     # Contoh lengkap: Jalankan spec login di BETA menggunakan Firefox
     ENV=beta npx playwright test tests/auth/login-real.spec.ts --project=firefox
     ```
   * **Headed Mode (Browser Terbuka)**:
     Untuk melihat jalannya pengujian di browser secara visual:
     ```bash
     # Menjalankan seluruh test suite dengan visual browser terbukan
     npx playwright test --headed

     # Menjalankan spec tertentu secara spesifik dengan visual browser terbuka
     npx playwright test tests/auth/login-real.spec.ts --headed

     # Contoh lengkap: Jalankan spec login di BETA menggunakan Firefox dengan visual browser terbuka
     ENV=beta npx playwright test tests/auth/login-real.spec.ts --project=firefox --headed
     ```
   * **UI Mode (Interactive Dashboard)**:
     ```bash
     npx playwright test --ui
     ```
     atau
     ```bash
     npm run test:ui
     ```
   * **Debug Mode (Playwright Inspector)**:
     ```bash
     npx playwright test --debug
     ```
     atau
     ```bash
     npm run test:debug
     ```

3. Open HTML report:
   ```bash
   npx playwright show-report
   ```
   atau
   ```bash
   npm run show-report
   ```

