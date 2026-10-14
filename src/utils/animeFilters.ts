import type { Anime } from '../types/anime'

export function filterAnimeBySearch(anime: Anime[], query: string): Anime[] {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  if (!normalizedQuery) return anime

  return anime.filter((item) => item.title.toLocaleLowerCase().includes(normalizedQuery))
}

export function filterAnimeByGenre(anime: Anime[], genreName: string): Anime[] {
  if (!genreName) return anime

  return anime.filter((item) => item.genres.some((genre) => genre.name === genreName))
}
