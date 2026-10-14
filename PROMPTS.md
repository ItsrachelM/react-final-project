# יומן פרומפטים

## 2026-10-14

**17:32 · copilot**

> Hi

**17:59 · copilot**

> Please create PRD.md and tasks.md for our Anime Series Master-Detail application based on the following specifications:
> 
> 1. PRD.md:
>    - Project Theme: Anime Series Catalog & Explorer.
>    - Core Pages:
>      1. Master View / Home: List of anime series fetched from a public free API (e.g., Jikan API / Jikan Moe endpoint for top anime), displaying thumbnails, titles, genres, and ratings. Includes search and filtering capabilities.
>      2. Detail View (/items/:id): Detailed view for a selected anime showing synopsis, episodes, score, studios, and trailer link using React Router and useParams.
>      3. Additional Page 1 (Favorites / Watchlist): Allows users to save favorite anime series (persisted via React state or localStorage).
>      4. Additional Page 2 (Statistics / Overview): Charts or statistical breakdown of genres/scores from the loaded anime data.
>    - Technical stack: React, Vite, TypeScript, React Router, Vitest for unit tests (at least 5 passing tests), responsive design, and robust state handling (Loading, Error, Success states).
> 
> 2. tasks.md:
>    Create a step-by-step checklist formatted with "Done when..." criteria:
>    - Task 1: Setup types/interfaces for the Anime API response.
>    - Task 2: Implement API service module to fetch anime data with error handling.
>    - Task 3: Set up React Router with layout, Home page, Detail page (/items/:id), Favorites page, and Statistics page.
>    - Task 4: Build Master list view with search, filter, and responsive grid layout.
>    - Task 5: Build Detail view page using useParams and display full anime details with loading/error states.
>    - Task 6: Implement Favorites / Watchlist feature.
>    - Task 7: Implement Statistics page.
>    - Task 8: Write at least 5 unit tests using Vitest (for filters, search, or helper functions).
>    - Task 9: Clean up console logs, verify `npm run build` and `npm run dev` pass without errors.
>    - Task 10: Finalize README.md and ensure PROMPTS.md is up to date.
