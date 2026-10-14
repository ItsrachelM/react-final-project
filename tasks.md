# Implementation Tasks

Complete the tasks in order. Check each item only after its **Done when...** criteria are met.

- [x] **Task 1: Set up Anime API types and interfaces**
  - Done when... TypeScript types describe the Jikan anime data used by the catalog, detail page, genres, studios, images, and optional fields without treating missing optional values as errors.

- [ ] **Task 2: Implement the Anime API service**
  - Done when... a service module fetches catalog and per-anime detail data from Jikan API v4, checks unsuccessful responses, and exposes useful errors to the UI.

- [ ] **Task 3: Set up routes and shared layout**
  - Done when... React Router renders a shared layout with navigation and working Home, `/items/:id`, Favorites / Watchlist, and Statistics routes, including sensible handling for an unknown route.

- [ ] **Task 4: Build the master list view**
  - Done when... the Home page displays responsive anime cards with thumbnails, titles, genres, and ratings, and search and genre filters work together with loading, error, empty, and no-match states.

- [ ] **Task 5: Build the anime detail view**
  - Done when... the detail page reads the anime ID with `useParams`, fetches and displays synopsis, episodes, score, studios, and an available trailer link, and handles loading, request failure, and unavailable anime.

- [ ] **Task 6: Implement Favorites / Watchlist**
  - Done when... users can add or remove anime from the catalog and detail page, see saved entries on the Favorites page, and retain the list after a reload using `localStorage`.

- [ ] **Task 7: Implement Statistics**
  - Done when... the Statistics page presents genre and score summaries based on the loaded anime data and handles missing or empty values clearly.

- [ ] **Task 8: Write unit tests with Vitest**
  - Done when... at least five unit tests pass, covering search, filters, or related reusable helper functions.

- [ ] **Task 9: Verify the application**
  - Done when... unnecessary console logs are removed, `npm run build` passes, and `npm run dev` starts the app without errors and the main routes can be checked in the browser.

- [ ] **Task 10: Finalize project documentation**
  - Done when... `README.md` explains how to install, run, and test the application, and `PROMPTS.md` contains the latest project prompts and task progress notes required by the project instructions.
