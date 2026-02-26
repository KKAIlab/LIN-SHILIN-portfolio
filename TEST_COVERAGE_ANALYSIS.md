# Test Coverage Analysis

## Executive Summary

The LIN-SHILIN portfolio project has **no automated test infrastructure**. All existing tests are manual, browser-based HTML pages that require human interaction to run and visually verify. There are no unit tests, no test runner, no CI/CD pipeline, and no code coverage tooling. This analysis identifies specific gaps and proposes prioritized improvements.

---

## Current State

### Source Code Inventory (~5,273 lines of JavaScript)

| File | Lines | Purpose | Risk Level |
|------|-------|---------|------------|
| `js/main.js` | 1,390 | Gallery rendering, profile updates, artwork display, scroll effects, contact form | High |
| `admin/js/admin.js` | 1,396 | Admin panel: artwork CRUD, profile editing, i18n editing, data import/export | High |
| `js/i18n.js` | 541 | Multi-language system (zh/en/ja), language switching, DOM updates | High |
| `admin/js/data-manager.js` | 511 | localStorage CRUD for artworks, profile, i18n, site config | Critical |
| `admin/js/deploy-helper.js` | 320 | Deploy modal, script download, clipboard operations | Low |
| `js/debug-monitor.js` | 500 | Debug logging and monitoring | Low |
| `js/simple-i18n-fix.js` | 203 | i18n patches | Medium |
| `admin/js/auth.js` | 154 | Password hashing, session management, login/logout | Critical |
| `admin/js/theme-manager.js` | 145 | Dark/light theme toggling, system preference detection | Low |
| `admin/js/login.js` | 113 | Login form handling, input validation | Medium |

### Existing Test Pages (Manual Only)

| File | What It Tests | Automated? |
|------|--------------|------------|
| `test-functions.html` | Language switching, localStorage data, artwork CRUD, data sync | No |
| `admin/debug-test.html` | Data storage, BroadcastChannel, sync triggers | No |
| `test-debug.html` | Language switching debug | No |
| `test-fixes.html` | Fix validation | No |

### What's Missing

- No `package.json` (no npm ecosystem)
- No test runner (Jest, Vitest, Mocha, etc.)
- No assertion library
- No code coverage tool
- No CI/CD pipeline
- No linter or static analysis
- No end-to-end testing framework

---

## Coverage Gap Analysis

### 1. `admin/js/auth.js` — CRITICAL, 0% automated coverage

This file manages authentication for the entire admin panel. Every function is untested by automated means.

**Untested functions and risk areas:**

| Function | Risk | What Could Go Wrong |
|----------|------|-------------------|
| `hashPassword(password)` | High | Hash collisions, empty string handling, special character handling |
| `verifyPassword(password)` | High | Incorrect comparison could lock out or allow unauthorized access |
| `login(password, remember)` | High | Session stored in wrong storage (localStorage vs sessionStorage) |
| `isLoggedIn()` | High | Session timeout logic could fail, allowing expired sessions |
| `getSession()` | Medium | Malformed JSON in storage could crash the app |
| `logout()` | Medium | Incomplete cleanup could leave ghost sessions |
| `refreshSession()` | Medium | Could fail to update timestamp, causing premature logout |
| `checkAuthOnLoad()` | Medium | Redirect logic depends on URL parsing |

**Specific edge cases that need tests:**
- What happens when `hashPassword("")` is called with an empty string?
- Does `isLoggedIn()` correctly expire sessions after 24 hours?
- Does `login()` correctly distinguish `remember=true` (localStorage) vs `remember=false` (sessionStorage)?
- Does `getSession()` handle corrupted/invalid JSON gracefully?
- Does `logout()` clean up both localStorage and sessionStorage?

### 2. `admin/js/data-manager.js` — CRITICAL, 0% automated coverage

This is the central data layer for the entire application. All artwork, profile, i18n, and config data flows through this class.

**Untested functions and risk areas:**

| Function | Risk | What Could Go Wrong |
|----------|------|-------------------|
| `addArtwork(artwork)` | High | ID generation could collide; data structure corruption |
| `updateArtwork(id, data)` | High | Partial update could overwrite fields; non-existent ID returns null silently |
| `deleteArtwork(id)` | High | Deleting non-existent ID returns false but no error |
| `getArtworkById(id)` | Medium | Type coercion issues (string vs number ID) |
| `importAllData(jsonData)` | High | Malformed JSON, partial imports, missing fields |
| `exportAllData()` | Medium | Could fail if any stored data is corrupted |
| `resetAllData()` | High | Should restore defaults completely |
| `getStatistics()` | Low | Category counting with unknown categories |
| `updateI18nData(lang, key, value)` | Medium | Missing language keys could silently fail |

**Specific edge cases that need tests:**
- Adding an artwork when the artworks array is empty (maxId calculation from empty array)
- Updating an artwork with an ID that doesn't exist
- Deleting an artwork that doesn't exist
- `importAllData()` with malformed JSON
- `importAllData()` with partially valid data (e.g., artworks present but profile missing)
- `getArtworks()` when localStorage contains invalid JSON
- `getStatistics()` with artworks that have unknown categories
- Round-trip test: export then import should produce identical data

### 3. `js/i18n.js` — HIGH PRIORITY, 0% automated coverage

The i18n system affects every visible text element on the site across 3 languages.

**Untested functions and risk areas:**

| Function | Risk | What Could Go Wrong |
|----------|------|-------------------|
| `getText(key, lang)` | High | Missing keys return the key itself — could display raw keys to users |
| `switchLanguage(lang)` | High | DOM update failures, partial switches |
| `getI18nData()` | Medium | Merging stored data with defaults could overwrite custom translations |
| `getProfileData()` | Medium | localStorage unavailable in some contexts |
| `updatePageMetadata(lang)` | Low | Unsupported language falls through |
| `initI18n()` | Medium | Default language detection from browser locale |

**Specific edge cases that need tests:**
- `getText()` with a key that doesn't exist in any language
- `getText()` with an unsupported language code
- `switchLanguage()` with invalid input (null, undefined, number, unsupported language)
- `switchLanguage()` called with the same language that's already active (should return true early)
- `getI18nData()` when localStorage has corrupted JSON
- Default language detection: browser set to English, Japanese, Chinese, or unsupported locale
- All three languages have the same set of translation keys (no missing translations)

### 4. `js/main.js` — HIGH PRIORITY, 0% automated coverage

The largest file with extensive DOM manipulation, event handling, and data rendering.

**Key untested areas:**

| Area | Risk | What Could Go Wrong |
|------|------|-------------------|
| `updateProfileData()` | High | Conditionally overrides i18n translations with profile data |
| `renderArtworks()` | High | Gallery rendering with filters, i18n text lookup |
| `filterArtworks(category)` | Medium | CSS class toggling, 'all' filter special case |
| `openArtworkModal(id)` | Medium | Modal display with dynamic data |
| Contact form submission | Medium | mailto: link generation, input validation |
| Scroll animations | Low | IntersectionObserver-based reveal |
| Stat counter animation | Low | Counting animation logic |

### 5. `admin/js/admin.js` — HIGH PRIORITY, 0% automated coverage

The admin panel contains complex CRUD operations with UI interactions.

**Key untested areas:**
- Section switching logic
- Artwork form validation and submission
- Image upload handling (base64 conversion)
- Profile editing and saving
- i18n text editing for all 3 languages
- Data import/export through file upload
- Dashboard statistics calculation
- Search and filter functionality

### 6. `admin/js/theme-manager.js` — LOW PRIORITY, 0% automated coverage

| Function | Risk | What Could Go Wrong |
|----------|------|-------------------|
| `toggleTheme()` | Low | Incorrect theme state |
| `applyTheme(theme)` | Low | DOM attribute not set correctly |
| `watchSystemTheme()` | Low | System preference change detection |
| `resetToSystemPreference()` | Low | localStorage cleanup |

---

## Proposed Test Improvements (Prioritized)

### Phase 1: Foundation Setup

**Set up automated test infrastructure:**
1. Initialize `package.json` with npm
2. Install Vitest (lightweight, no-config test runner for vanilla JS)
3. Install `jsdom` for DOM simulation
4. Add `npm test` script
5. Add a basic GitHub Actions workflow for CI

### Phase 2: Critical Path Unit Tests

**Priority 1 — `auth.js` tests (~15 test cases):**
- Password hashing determinism and consistency
- Login with correct/incorrect password
- Session creation in localStorage vs sessionStorage based on `remember` flag
- Session expiration after 24 hours
- Logout cleanup
- Graceful handling of corrupted session data

**Priority 2 — `data-manager.js` tests (~25 test cases):**
- Artwork CRUD: add, get, getById, update, delete
- ID auto-increment logic
- Profile get/set/update
- i18n data get/set/update for each language
- Site config get/set/update
- Data export produces valid JSON
- Data import from valid JSON
- Data import from invalid JSON (error handling)
- Reset restores all defaults
- Statistics calculation accuracy

**Priority 3 — `i18n.js` pure function tests (~12 test cases):**
- `getText()` with valid key and language
- `getText()` with missing key (fallback behavior)
- `switchLanguage()` input validation
- Translation completeness: all keys present in all 3 languages
- Language preference persistence to localStorage
- `getI18nData()` merge behavior with stored data

### Phase 3: Integration Tests

**Priority 4 — Admin panel workflows (~10 test cases):**
- Add artwork through admin → verify it appears in data-manager
- Edit artwork → verify update persists
- Delete artwork → verify removal
- Import data → verify all sections populated
- Export then import → verify round-trip fidelity

**Priority 5 — Frontend rendering (~8 test cases):**
- Gallery renders correct number of artwork cards
- Category filter shows/hides correct artworks
- Language switch updates all `[data-i18n]` elements
- Profile data overrides i18n translations where applicable
- Modal opens with correct artwork data

### Phase 4: Edge Cases and Robustness

**Priority 6 — Error handling and boundary conditions (~10 test cases):**
- localStorage full/unavailable
- Corrupted JSON in any storage key
- Concurrent modifications (two tabs)
- Empty state handling (no artworks, no profile)
- XSS prevention in user-editable content (artwork titles, profile bio)

---

## Estimated Impact

| Metric | Current | After Phase 1-2 | After Phase 1-4 |
|--------|---------|-----------------|-----------------|
| Automated tests | 0 | ~52 | ~80 |
| Code with unit tests | 0% | ~35% (auth + data-manager + i18n) | ~60% |
| CI/CD pipeline | None | Basic (test on push) | Full (test + lint) |
| Regression detection | Manual only | Critical paths automated | Comprehensive |

---

## Security-Specific Test Recommendations

1. **Password handling**: Verify `hashPassword()` doesn't produce trivially predictable hashes. Test that different passwords produce different hashes.
2. **Session management**: Verify sessions expire correctly and can't be forged by manually setting localStorage values.
3. **Data import validation**: Test that `importAllData()` doesn't execute arbitrary code embedded in JSON payloads.
4. **XSS in user content**: Test that artwork titles, descriptions, and profile bio containing `<script>` tags are safely handled when rendered to the DOM (currently using `textContent` which is safe, but `innerHTML` usage in `admin.js` needs verification).
