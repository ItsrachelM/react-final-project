import { describe, expect, it } from 'vitest'
import { getFallbackAnime } from '../services/animeApi'
import type { Anime } from '../types/anime'
import { filterAnimeByGenre, filterAnimeBySearch } from '../utils/animeFilters'

const sampleAnime: Anime[] = [
  {
    id: 1,
    title: 'Cowboy Bebop',
    synopsis: 'Space bounty hunters.',
    episodes: 26,
    score: 8.75,
    images: { standard: '/cowboy.jpg', large: '/cowboy-large.jpg' },
    genres: [{ id: 1, name: 'Action' }, { id: 24, name: 'Sci-Fi' }],
    studios: [{ id: 14, name: 'Sunrise' }],
    trailer_url: null,
  },
  {
    id: 2,
    title: 'A Silent Voice',
    synopsis: 'A story about friendship.',
    episodes: 1,
    score: 8.9,
    images: { standard: '/voice.jpg', large: '/voice-large.jpg' },
    genres: [{ id: 8, name: 'Drama' }],
    studios: [{ id: 44, name: 'Kyoto Animation' }],
    trailer_url: null,
  },
]

describe('anime filtering', () => {
  it('matches titles without case sensitivity', () => {
    expect(filterAnimeBySearch(sampleAnime, 'COWBOY')).toEqual([sampleAnime[0]])
  })

  it('trims the search query before matching titles', () => {
    expect(filterAnimeBySearch(sampleAnime, '  silent  ')).toEqual([sampleAnime[1]])
  })

  it('returns all anime when the search query is empty', () => {
    expect(filterAnimeBySearch(sampleAnime, '  ')).toEqual(sampleAnime)
  })

  it('filters anime by genre name', () => {
    expect(filterAnimeByGenre(sampleAnime, 'Action')).toEqual([sampleAnime[0]])
  })

  it('returns all anime when no genre filter is selected', () => {
    expect(filterAnimeByGenre(sampleAnime, '')).toEqual(sampleAnime)
  })
})

describe('local anime fallback data', () => {
  it('provides a non-empty list of typed anime with valid IDs, scores, and images', () => {
    const fallback = getFallbackAnime()

    expect(fallback.length).toBeGreaterThanOrEqual(5)
    for (const anime of fallback) {
      expect(Number.isSafeInteger(anime.id)).toBe(true)
      expect(anime.id).toBeGreaterThan(0)
      expect(anime.score).toBeTypeOf('number')
      expect(anime.images.standard).toBeTypeOf('string')
      expect(anime.images.large).toBeTypeOf('string')
      expect(anime.genres.length).toBeGreaterThan(0)
      expect(anime.studios.length).toBeGreaterThan(0)
    }
  })
})
