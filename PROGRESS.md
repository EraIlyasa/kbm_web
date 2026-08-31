# PROGRESS.md

File ini adalah catatan progres / konteks sesi yang dibaca ulang oleh AI agent di sesi chat baru, supaya agent tahu apa yang sudah dikerjakan dan apa yang belum, tanpa perlu menelusuri ulang dari nol.

## Ringkasan sesi

### Sesi sebelumnya

1. Membuat `AGENTS.md` di root — dokumen konteks/onboarding yang dibaca otomatis agent di tiap sesi baru.
2. Membuat `data/register-account.json` — berisi test data register (single object).
3. Membuat `tests/register-new-account/register/register.spec.ts` — test case register (1 scenario, berhenti setelah fill form).
4. Membersihkan komentar `//` yang tidak perlu di `register.spec.ts`.
5. Memperbarui `.opencode/agents/review.md` — aturan komentar NIT.

### Sesi ini (update terbaru)

6. Update `data/register-account.json` — dari single object menjadi array 5 akun dengan email `testjakarta01-05@kbmapp.com` dan password `pisanggoreng0987`.
7. Update `register.spec.ts` — semua 5 scenario pakai index yang benar (`registerData[0]` s/d `registerData[4]`), fix indentation.
8. Tambah step **submit** (`registerPage.submit()`) dan **verifikasi** (`expect(registerPage.successMessage).toContainText('Email sudah terkirim')`) di semua 5 scenario.
9. Tambah locator `successMessage` di `RegisterPage.ts` — `this.page.getByText('Email sudah terkirim')`.
10. Tambah `test.afterEach` dengan delay 10 detik untuk hindari reCAPTCHA v3 rate-limiting.

### Sesi ini — skenario search buku + verifikasi lintas browser

11. Tambah `test.beforeAll` di `register.spec.ts` — reset semua email terdaftar via `ReturnAllApi.resetRegisteredEmail()` agar test idempotent (fix email sudah terdaftar dari run sebelumnya).
12. Buat skenario **search buku**:
    - `pages/BookPage.ts` (baru) — locator judul buku detail, `getBookCard(title)`, `openBook(title)`, `goto()`.
    - `pages/DashboardPage.ts` — tambah `searchInput` (placeholder "Cari judul buku"), `searchButton` (button.searchButton), method `searchBook(title)`.
    - `constants/URLs.ts` — tambah `PAGES.BOOK: '/book'`.
    - `fixtures/page.fixture.ts` — daftarkan `bookPage`.
    - `tests/search-book/search-book.spec.ts` (baru) — login → search "Automation Novel Buku" → klik hasil → verifikasi judul.
13. Verifikasi lintas browser: search-book lolos di **Firefox, Chrome, dan Safari** (login via UI tanpa auth-state.json).

## Detail test case register

- Lokasi: `tests/registration/register.spec.ts` (folder dulu bernama `register-new-account/`).
- Alur setiap scenario:
  1. `welcomePage.goto()` — landing page
  2. `welcomePage.masukButton.click()` — klik "Masuk"
  3. `loginPage.registerLink.click()` — klik "Daftar di sini"
  4. `page.waitForURL('**/register')` — tunggu halaman register
  5. `registerPage.fillRegisterForm(email, password)` — isi form
  6. `registerPage.submit()` — klik tombol "Daftar"
  7. `expect(registerPage.successMessage).toContainText('Email sudah terkirim')` — verifikasi
- Test data dari `data/register-account.json` (array 5 objek).
- Tag: `['@register', '@regression']`.
- `test.afterEach`: delay 10 detik antar test case (reCAPTCHA cooldown).
- Import `test` dan `expect` dari `../../../fixtures/page.fixture.js` (bukan `@playwright/test` langsung).

## Test data register

| # | Email | Password |
|---|-------|----------|
| 1 | testjakarta01@kbmapp.com | pisanggoreng0987 |
| 2 | testjakarta02@kbmapp.com | pisanggoreng0987 |
| 3 | testjakarta03@kbmapp.com | pisanggoreng0987 |
| 4 | testjakarta04@kbmapp.com | pisanggoreng0987 |
| 5 | testjakarta05@kbmapp.com | pisanggoreng0987 |

## Status terakhir test

| Run | Passed | Failed | Catatan |
|-----|--------|--------|---------|
| Run 1 (tanpa delay) | 3/5 | 2 (scenario 4, 5) | reCAPTCHA rate-limit |
| Run 2 (delay 10s) | 2/5 | 3 (scenario 1, 4, 5) | Email sudah terdaftar dari run sebelumnya |
| Run 3 (reset via API + search-book) | 8/8 | 0 | Lihat tabel verifikasi lintas browser di bawah |

**Kesimpulan**: Setelah ditambah reset email via `ReturnAllApi` di `beforeAll`, semua scenario register lolos. reCAPTCHA v3 di dev server **tidak lagi memblokir otomasi** di Firefox, Chrome, maupun Safari.

## Verifikasi lintas browser (sesi terakhir)

| Skenario | Firefox | Chrome | Safari |
|----------|---------|--------|--------|
| search-book | ✓ 16.8s | ✓ 16.9s | ✓ 17.5s |
| register (5 test) | ✓ 1.6m | — | — |
| smoke-test (01, 02) | ✓ 44.4s | — | — |
| story (11 chapter) | ✓ 1.8m | — | — |

Catatan:
- `auth-state.json` **tidak ada** saat test dijalankan, jadi semua login dilakukan via UI (`loginAs`), bukan skip via storageState.
- `tests/smoke-test/03-smoke-test.spec.ts` saat ini **di-comment semua** (register sudah dipindah ke `tests/registration/`), jadi tidak menghasilkan test.

## Keputusan & konvensi yang disepakati

- Test data register memakai file JSON di folder `data/` (pola baru).
- Kode harus clean: hindari komentar `//` yang tidak perlu; kode self-documenting.
- Dokumentasi agent context ada di `AGENTS.md`; catatan progres ada di `PROGRESS.md`.

## Belum dikerjakan (next steps / status terbuka)

- ~~`tests/smoke-test/03-smoke-test.spec.ts` sudah redundant (di-comment)~~ → **dihapus**.
- ~~Catatan lama `auth.setup.ts` + `storageState` soal "hanya Firefox"~~ → **dibersihkan**: `tests/auth.setup.ts` dihapus, project `setup` & `storageState`/`auth-state.json` dihapus dari `playwright.config.ts`, entry `auth-state.json` di `.gitignore` dihapus, `AGENTS.md` diperbarui (3 project, login via UI `loginAs`).

## Catatan penting

- reCAPTCHA v3 di dev server (`dev-web.ccmhoster.com`) **tidak memblokir otomasi** — login UI lolos di Firefox, Chrome, dan Safari (catatan lama "hanya Firefox" sudah tidak berlaku).
- Login semua test kini langsung via UI (`utils/AuthFlow.ts` → `loginAs`); tidak ada lagi `setup` project atau `storageState`.
- `RegisterPage.ts` sekarang punya locator `successMessage` untuk teks "Email sudah terkirim".
- `RegisterPage.ts` sudah punya method `submit()` — klik tombol "Daftar" dengan timeout `Timeouts.RENDER` (tombol disabled sampai reCAPTCHA v3 fire).
- `BookPage.ts` menangani halaman hasil pencarian (`/book`) dan detail buku (`/book/detail/:id`); judul detail dilokasi via `getByRole('heading', { level: 1 })`.
- Search form di navbar: placeholder "Cari judul buku...", tombol `button.searchButton`, kartu hasil `a.book-content`.
