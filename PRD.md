# Product Requirements Document

## Project

**Anime Series Catalog & Explorer** is a responsive React application for discovering anime series, viewing detailed information, maintaining a personal watchlist, and exploring the available catalog through statistics.

## Goals

- Make a browsable catalog of anime available from a free public API.
- Let users find titles using search and genre filters.
- Provide a dedicated detail page for each anime.
- Let users save favorites across browser sessions.
- Summarize the anime data currently available to the application.
- Provide clear loading, success, empty, and error experiences.

## Audience

Anime viewers who want to explore series, compare basic information, and keep a lightweight personal watchlist.

## Application structure and requirements

### Home — Master View

- Fetch the top anime catalog from Jikan API v4 (for example, `GET https://api.jikan.moe/v4/top/anime`).
- Display each anime as a responsive catalog card with its thumbnail, title, genres, and rating/score.
- Support text search by title and filtering by genre. Search and filters should work together and update the displayed results without another request.
- Provide navigation from each card to its detail route.
- Represent loading, successful results, no matching results, and request failures distinctly.

### Anime detail — `/items/:id`

- Use React Router and `useParams` to identify the selected anime.
- Fetch the anime details by ID from Jikan API v4 (for example, `GET https://api.jikan.moe/v4/anime/{id}/full`).
- Display the title, synopsis, episode count, score, studios, genres, and a trailer link when available.
- Provide loading, not-found/error, and success states; do not treat missing optional API fields as request failures.
- Include a way to add or remove the anime from Favorites.

### Favorites / Watchlist

- Show the anime saved by the user and provide a way to remove an entry.
- Persist favorite anime in `localStorage` so the list survives reloads.
- Keep favorite state consistent between the catalog, detail page, and watchlist.
- Show a useful empty state when there are no saved anime.

### Statistics / Overview

- Present a readable statistical breakdown of the catalog data available to the application, including genre and score summaries.
- Derive statistics from the loaded anime data and label the scope accurately (for example, currently loaded results).
- Handle empty or incomplete data without rendering misleading values.

## Technical requirements

- **UI:** React, Vite, and TypeScript.
- **Routing:** React Router for the Home, `/items/:id`, Favorites, and Statistics pages.
- **Data source:** Jikan API v4, a free public API; no API key or private credential should be required.
- **Testing:** Vitest; provide at least five passing unit tests, focused on search, filters, or other data/helper logic.
- **Responsive design:** Support narrow mobile screens through desktop layouts, including the catalog grid and navigation.
- **State handling:** Make loading, error, success, empty, and not-found cases explicit wherever applicable. Keep API, filter, and favorite state changes predictable.

## Quality and accessibility

- Use semantic page structure and accessible names for interactive controls and links.
- Ensure search, filters, navigation, and favorite controls can be operated with a keyboard.
- Use image alternatives appropriate to the anime title and avoid broken-image layouts when an image is unavailable.
- Keep API errors visible to users with a retry or navigation path where practical; do not silently present failed requests as empty results.
- Avoid unnecessary requests and respect the public API's availability and rate limits.

## Out of scope

- User accounts, remote synchronization, or a backend service.
- Creating or editing anime entries.
- A guarantee that statistics represent every anime in the Jikan catalog; summaries represent only data loaded by the application.

## Acceptance criteria

- Users can browse the fetched catalog, search titles, filter by genre, and open an anime detail page.
- The detail page is driven by the route ID and presents the requested anime information with explicit loading and failure states.
- Users can add and remove favorites, and favorites remain after reloading the application.
- The Statistics page displays meaningful summaries of the loaded data and handles missing/empty values.
- The application adapts to mobile and desktop screens.
- At least five Vitest unit tests pass, and `npm run build` completes successfully.
