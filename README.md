# Anime Explorer (Anime Core)

Anime Explorer is a master-detail anime catalog built with React and TypeScript. Browse series, search by title, filter by genre, open detailed series pages, save favorites across visits, and review catalog statistics such as average score, episode totals, and common genres.

## Data source

The application fetches public anime data from the [Jikan API](https://jikan.moe/), an unofficial REST API for MyAnimeList. It uses the Jikan API v4 top anime endpoint and falls back to a local anime catalog when the API is unavailable or returns no results, so the main catalog and statistics remain usable offline.

## Requirements

- Node.js and npm

## Installation

From the project directory, install dependencies:

```sh
npm install
```

## Run the development server

```sh
npm run dev
```

Vite prints the local URL in the terminal after the server starts.

## Production build

```sh
npm run build
```

This command runs the TypeScript project build and creates the production app in `dist/`.

## Tests

Run the Vitest unit tests once:

```sh
npm test
```

Open the interactive Vitest UI:

```sh
npm run test:ui
```

## Main features

- Responsive anime catalog with title search and genre filtering.
- Detail pages with series information, genres, studios, scores, episodes, and synopsis.
- Favorites saved in browser local storage.
- Statistics for the available catalog, including total series, average score, total episodes, and genre counts.
- Local catalog fallback for API outages or empty responses.
