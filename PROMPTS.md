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

**18:03 · copilot**

> Please create a TypeScript types file for our anime project.
> 1. Create src/types/anime.ts containing interfaces for:
>    - Anime item (id, title, synopsis, episodes, score, images with standard/large formats, genres, studios, trailer_url).
>    - API response structure wrapper.
> 2. Update tasks.md to mark the type definitions task as done.
> 3. Update PROMPTS.md with a brief note of this prompt and action.

Action note: Added Anime and Jikan response wrapper interfaces in `src/types/anime.ts`, and marked Task 1 done in `tasks.md`.

**18:06 · copilot**

> Please create the API service for fetching anime data.
> 1. Create `src/services/animeApi.ts` using native `fetch` to connect to the public Jikan API (https://api.jikan.moe/v4).
> 2. Implement functions:
>    - `fetchTopAnime(page?: number, limit?: number)`: Fetches top anime series.
>    - `fetchAnimeById(id: string | number)`: Fetches detailed info for a single anime.
>    - `searchAnime(query: string)`: Searches for anime by keyword.
> 3. Handle HTTP errors gracefully and ensure TypeScript return types match our `Anime` interfaces without using `any`.
> 4. Update `tasks.md` to mark API service creation as done.
> 5. Append a summary line to `PROMPTS.md`.

Action note: Added typed Jikan fetch/search functions with normalized anime data and HTTP/response error handling in `src/services/animeApi.ts`, and marked Task 2 done in `tasks.md`.
