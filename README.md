# Enterprise Playwright Automation Framework

This is a TypeScript-based, enterprise-grade Playwright automation framework designed following the strict guidelines of the Engineering Handbook.

## Folder Structure

```text
├── playwright.config.ts        # Central config (Single Source of Truth)
├── tsconfig.json               # TypeScript strict mode settings
├── package.json                # Project dependencies and script commands
├── .env                        # Environment secrets (ignored by Git)
├── .env.example                # Template for environment variables
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

## Environment Variables

Copy `.env.example` to `.env` and fill in real values. Never commit real credentials.

| Variable | Description |
| --- | --- |
| `BASE_URL` | Base URL of the application under test |
| `WRITE_URL` | Base URL of the writing/editing application under test |
| `MOCK_NETWORK` | *(optional — not consumed by current code)* Enable network mocking (`true`/`false`) |
| `BROWSER` | *(optional — not consumed by current code)* Target browser (the suite is configured to run on `firefox`) |
| `TEST_ACCOUNT_1_EMAIL` / `TEST_ACCOUNT_1_PASSWORD` | First test account credentials |
| `TEST_ACCOUNT_2_EMAIL` / `TEST_ACCOUNT_2_PASSWORD` | Second test account credentials |
| `TEST_ACCOUNT_3_EMAIL` / `TEST_ACCOUNT_3_PASSWORD` | Third test account credentials |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin user credentials (used by `UserBuilder`) |
| `CUSTOMER_EMAIL` / `CUSTOMER_PASSWORD` | Customer user credentials (used by `UserBuilder`) |

**Important:** Test account credentials must never be committed to the repository. Only the `.env` file (which is git-ignored) may contain real values.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure the environment:
   ```bash
   cp .env.example .env
   # then fill in real values, see "Environment Variables" above
   ```

3. Running the Tests:
   * **Headless Mode (Default/Background)**:
     ```bash
     npx playwright test
     ```
     atau
     ```bash
     npm run test
     ```
   * **Smoke Tests (firefox, tag @smoke)**:
     ```bash
     npm run test:smoke
     ```
   * **Regression Tests (firefox)**:
     ```bash
     npm run test:regression
     ```
   * **Running Specific Spec Files**:
     Untuk menjalankan file tes tertentu secara spesifik:
     ```bash
     # Menjalankan test authentication & profile saja
     npx playwright test tests/auth/smoke-test.spec.ts

     # Menjalankan test pembuatan cerita & 11 bab saja
     npx playwright test tests/story/create-story.spec.ts
     ```
   * **Headed Mode (Browser Terbuka)**:
     Untuk melihat jalannya pengujian di browser secara visual:
     ```bash
     # Menjalankan seluruh test suite dengan visual browser terbukan
     npx playwright test --headed

     # Menjalankan spec tertentu secara spesifik dengan visual browser terbuka
     npx playwright test tests/auth/smoke-test.spec.ts --headed
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
    * **Run by tagging but with custom conditions a.k.a doing test 5 times of each test cases**
    ```bash
    npx playwright test --project=chrome --grep subscribe

    npx playwright test --project=chrome --grep regression
    ```

4. Open HTML report:
   ```bash
   npx playwright show-report
   ```
   atau
   ```bash
   npm run show-report
   ```

## Browser Support

The suite runs on a single `firefox` project. Chromium and WebKit are intentionally not configured: the application uses reCAPTCHA v2, which blocks automation in those engines. Run a specific project explicitly with:

```bash
npx playwright test --project=firefox
```

## Architecture Rules

- **Page objects are action-oriented, no assertions** — `pages/` contain only interactions and navigation; assertions live exclusively in `tests/`.
- **Single source of truth** — constants (URLs, roles, timeouts) live in `constants/`; never hardcode strings or numbers.
- **Dependency injection** — tests use the custom fixtures from `fixtures/page.fixture.ts`; never instantiate page objects directly in tests.
  - **Deliberate exception:** popup windows are not covered by the fixtures, so their page objects are instantiated directly in the spec against the popup page, e.g. `new TimelinePage(newPage)` for the timeline popup opened by `inputTimelineTrigger`.
- **Secrets hygiene** — credentials are read from environment variables via `utils/EnvUtils.ts`; real values live only in the git-ignored `.env`.
