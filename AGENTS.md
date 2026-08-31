# AGENTS.md

Dokumen ini adalah **agent context / onboarding** untuk Enterprise Playwright Automation Framework (KBM-WEB-2). File ini dibaca otomatis oleh AI agent (Manager, Build, Review, Explore, General) di setiap sesi chat baru. **Baca file ini terlebih dahulu** sebelum melakukan eksplorasi proyek, agar tidak perlu menelusuri ulang seluruh repositori dari nol.

## Tech Stack

| Komponen | Detail |
| --- | --- |
| Test runner | Playwright Test (`@playwright/test` `^1.45.0`) |
| Bahasa | TypeScript strict (`^5.3.3`) |
| Env | `dotenv` (`^16.4.5`), `@types/node` |
| `tsconfig.json` | `strict: true`, `target: ES2022`, `module: Node16`, `moduleResolution: Node16` |

> **Konsekuensi penting** dari `module: Node16`: semua relative import **wajib memakai ekstensi `.js`** walau file-nya `.ts`.
> Contoh: `import { LoginPage } from '../pages/LoginPage.js'`.

### `playwright.config.ts`

- `testDir: './tests'`, `timeout: 30s`, `expect.timeout: 5s`
- `fullyParallel: false`, `retries: CI ? 2 : 0`, `workers: 2`
- Reporter: `list`, `html`, `junit` (output `reports/junit.xml`)
- `use`: `testIdAttribute: 'data-testid'`, `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'`, `video: 'on'`

### Browser & Project

- 4 project (1 setup + 3 browser):
  - `setup` — `Desktop Chrome`, `testMatch: /.*\.setup\.ts/` (jalankan `tests/auth.setup.ts`)
  - `firefox` — `Desktop Firefox`
  - `chrome` — `Desktop Chrome` (pakai `--disable-blink-features=AutomationControlled`)
  - `safari` — `Desktop Safari`
- **Auth via storageState**: project `setup` (`tests/auth.setup.ts`) login sekali via UI dan menyimpan sesi ke `playwright/.auth/user.json`. Semua project browser punya `storageState` + `dependencies: ['setup']`.
- Untuk login di dalam test, prefer `loginAsTestUser()` dari `utils/AuthFlow.ts` (smart — cek storageState sebelum fallback UI login), bukan `loginAs()` setiap test.
- Cara pilih browser: flag Playwright `--project=firefox|chrome|safari` atau npm scripts (`npm run test:firefox`, `npm run test:chrome`, `npm run test:safari`, smoke per browser: `npm run test:smoke`, `npm run test:smoke:chrome`, `npm run test:smoke:safari`). Contoh: `npx playwright test --project=chrome`.
- Seleksi env: `ENV=beta` → `.env.beta`, selain itu `.env`. Error jika `BASE_URL` hilang.

## Struktur Direktori

| Direktori | Tanggung Jawab |
| --- | --- |
| `pages/` | Page Object Model, file `PascalCasePage.ts`: `LoginPage.ts`, `DashboardPage.ts`, `WelcomePage.ts`, `SettingsPage.ts`, `TimelinePage.ts`, `ProfilePage.ts`, `WritingPage.ts`, `RegisterPage.ts`, `ForgotPasswordPage.ts`, `BookPage.ts`, `BookReviewPage.ts`, `ChapterCommentPage.ts`, `CategoryPage.ts`, `TopupPage.ts`, `TransferPage.ts`, `ExchangePage.ts` |
| `components/` | Component Object Model (SEDANG KOSONG, disiapkan untuk komponen UI bersama) |
| `fixtures/` | Custom fixture + dependency injection; file kunci `fixtures/page.fixture.ts` |
| `tests/` | Satu-satunya tempat assertion; `*.spec.ts`; subfolder: `smoke-test/`, `story/`, `registration/`, `search-book/`, `chapter-comment/`, `book-review/`, `category/`, `topup/`, `transfer-coin/`, `tukar-koin/`, `subscribe-book/` |
| `api/` | API client per domain (`AuthApi.ts`, `ReturnAllApi.ts`) |
| `builders/` | Builder pattern (`UserBuilder.ts`) |
| `constants/` | Roles, URLs, Timeouts, Credentials (`URLs.ts`, `Timeouts.ts`, `Roles.ts`, `Credentials.ts`, `RegisterAccounts.ts`) |
| `utils/` | Pure functions (`EnvUtils.ts`, `AuthFlow.ts`, `DateTimeUtils.ts`, `TextUtils.ts`, `RandomUtils.ts`, `HumanizedInteractions.ts`) |
| `data/` | Test data statis JSON untuk skenario data-driven (`register-account.json`, `best-seller-books.json`) |
| `models/` | Interface TS entitas bisnis (`User.ts`) |
| `models/` | Interface TS entitas bisnis (`User.ts`) |
| Root | `LOGO.png` & `LOGO.pdf` = file upload untuk test |

## Konvensi Arsitektur (WAJIB)

1. Spec **TIDAK** import `@playwright/test` langsung — selalu import `test`/`expect` dari `../fixtures/page.fixture.js` (path relatif menyesuaikan).
2. Setiap page object baru WAJIB didaftarkan di `fixtures/page.fixture.ts` (3 langkah: import + tambah entri type `CustomFixtures` + tambah entri `base.extend`). Page object di-inject via argumen destructuring di test, **TIDAK** di-`new` langsung (kecuali popup window).
3. Page object: class-based, stateless, locator dideklarasikan sebagai field `readonly` di constructor, method hanya action (return `void`/`Page`/`Locator`), ada `goto()` untuk navigasi, **TANPA assertion**. Tidak ada base class inheritance.
4. Test: satu-satunya tempat `expect()`. Struktur: `test.describe('<Domain> Specifications')`, `test.step()` untuk langkah, judul `"User should <action> and <verify>"`, tag Playwright `['@smoke', '@regression', ...]`.
5. **No hardcode** — URL/role/timeout/kredensial/teks harus dari `constants/`, secret via `utils/EnvUtils.ts` (`requireEnv()`), nilai real hanya di `.env` (git-ignored).
6. Strategi locator: prefer `getByRole`/`getByLabel`/`getByPlaceholder`; `{ exact: true }` untuk disambiguasi; `.filter({ hasText })`, `.first()`, `.or()` untuk fallback.
7. Setelah perubahan kode WAJIB `npx tsc --noEmit`.

## Cara Menjalankan

- `npm run test` / `npx playwright test` — semua test
- `npm run test:ui`, `npm run test:debug`, `npm run test:smoke` (firefox + grep `@smoke`), `npm run test:regression`, `npm run show-report`
- Script per browser: `npm run test:firefox`, `npm run test:chrome`, `npm run test:safari`, `npm run test:smoke:chrome`, `npm run test:smoke:safari`
- Typecheck: `npx tsc --noEmit`

## Alur Agent

Ada 3 agent file di `.opencode/agents/`:

| File | Peran |
| --- | --- |
| `manager.md` | Planning & orchestration — memecah tugas, mendelegasikan, memantau progres |
| `build.md` | Implementasi — menulis/mengubah kode (page object, fixture, builder, test, utility) |
| `review.md` | Review — memeriksa kepatuhan kode terhadap Engineering Handbook |

Konvensi detail dan workflow masing-masing agent ada di file tersebut. Baca file agent yang relevan sebelum mengerjakan tugas.
