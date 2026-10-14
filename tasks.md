# Implementation Tasks

Complete the tasks in order. Check each item only after its **Done when...** criteria are met.

- [x] **Task 1: Set up Anime API types and interfaces**
  - Done when... TypeScript types describe the Jikan anime data used by the catalog, detail page, genres, studios, images, and optional fields without treating missing optional values as errors.

- [x] **Task 2: Implement the Anime API service**
  - Done when... a service module fetches 25 anime by default from Jikan API v4, maps Jikan `images.jpg` URLs, retries transient failures, and falls back to at least 20 typed local anime when the API is unavailable.

- [x] **Task 3: Set up routes and shared layout**
  - Done when... React Router renders a shared layout with navigation and working Home, `/items/:id`, Favorites / Watchlist, and Statistics routes, including sensible handling for an unknown route.

- [x] **Task 4: Build the master list view**
  - Done when... the Home page immediately filters loaded anime as the user types or selects a genre, combines case-insensitive title and genre filters, handles empty/no-match states, and displays a responsive grid of at least 20 anime with images, titles, genres, and scores.

- [x] **Task 5: Build the anime detail view**
  - Done when... the detail page reads the anime ID with `useParams`, immediately finds the matching cached or local anime, and displays its image, synopsis, episodes, score, studios, and available trailer without making another request.

- [x] **Task 6: Implement Favorites / Watchlist**
  - Done when... users can add or remove anime from the catalog and detail page, see saved entries on the Favorites page, and retain the list after a reload using `localStorage`.

- [x] **Task 7: Implement Statistics**
  - Done when... the Statistics page presents total series, average score, episode, and genre summaries, starts with local data while fetching, and handles missing or empty values clearly.

- [x] **Task 8: Write unit tests with Vitest**
  - Done when... at least five unit tests pass, covering search, filters, or related reusable helper functions.

- [ ] **Task 9: Verify the application**
  - Done when... unnecessary console logs are removed, `npm run build` passes, and `npm run dev` starts the app without errors and the main routes can be checked in the browser.

- [ ] **Task 10: Finalize project documentation**
  - Done when... `README.md` explains how to install, run, and test the application, and `PROMPTS.md` contains the latest project prompts and task progress notes required by the project instructions.

## Progress note — 2026-10-14

- Hardened the Jikan v4 integration with structured `data` parsing diagnostics and a warning when top-anime requests fall back to local data.
- Added image URL selection for Jikan JPG/WebP and legacy top-level URLs, with an inline SVG fallback for failed catalog and detail images.
- Confirmed title and genre filters remain case-insensitive and composable; added image URL regression coverage.
- Verification: `npm.cmd test` (10 tests passed), `npm.cmd run build` (passed), and the Vite dev server returned HTTP 200. Task 9 remains open pending browser checks of the main routes.
- Fixed shared-poster regression by mapping each fallback MAL ID to a distinct title poster, preserving Jikan image URLs during normalization, and correcting Dr. Stone's MAL ID to 38691; tests assert unique fallback posters and ID-to-poster examples.
- Verification: `npm.cmd test` (10 tests passed) and `npm.cmd run build` (passed). External CDN image availability still depends on the client network; failed loads use title-specific inline SVG posters.

## Progress note — Favorites UI

- Added shared, persisted favorite state with safe `localStorage` parsing and a heart toggle on catalog cards and the detail page.
- Replaced the Favorites placeholder with a saved-series grid and friendly empty state; added polished gradient surfaces, active navigation, card/button transitions, and responsive heart controls.
- Statistics implementation (Task 7) was completed in the Statistics fallback progress note below.

## Progress note — Anime dark theme

- Switched the app to an always-on deep slate theme with light text, accessible violet accents, subtle background glows, and coordinated surfaces and borders.
- Restyled shared navigation, cards, search controls, buttons, detail/stat panels, error messaging, and favorite/empty states so they remain readable on dark surfaces.
- Statistics was implemented after this theme progress note; this note covers global visual styling only.

## Progress note — Home responsive layout

- Reduced the Home heading and search/filter toolbar spacing and arranged search, genre, and submit controls in a compact desktop row.
- Added responsive catalog breakpoints: three columns for tablet widths, two columns on most phones, and a single-column layout on narrow phones with stacked controls.
- Kept the Home layout changes scoped to its page; viewport rendering was not browser-verified in this change.

## Progress note — Statistics fallback

- Initialized Statistics with the local anime catalog so series, average score, total episodes, and genre metrics display immediately, including while the live request is pending.
- Empty API responses no longer replace valid local data, and request failures leave the fallback metrics visible with a retry option.
- Completed Task 7 with score, genre, series-count, episode-count, and empty-value handling.

## Progress note — Anime Core branding

- Updated the shared navigation brand and browser document title to Anime Core; restored the Home hero heading to Anime Explorer.
