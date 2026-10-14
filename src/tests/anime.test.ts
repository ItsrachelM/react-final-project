import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTopAnime, getAnimeImageUrl, getFallbackAnime } from '../services/animeApi'
import type { Anime } from '../types/anime'
import { filterAnime, filterAnimeByGenre, filterAnimeBySearch } from '../utils/animeFilters'

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

  it('matches genre names without case sensitivity', () => {
    expect(filterAnimeByGenre(sampleAnime, '  ACTION ')).toEqual([sampleAnime[0]])
  })

  it('combines title search and genre filters', () => {
    expect(filterAnime(sampleAnime, 'cowboy', 'sci-fi')).toEqual([sampleAnime[0]])
    expect(filterAnime(sampleAnime, 'cowboy', 'drama')).toEqual([])
  })

  it('returns all anime when no genre filter is selected', () => {
    expect(filterAnimeByGenre(sampleAnime, '')).toEqual(sampleAnime)
  })
})

describe('local anime fallback data', () => {
  it('selects Jikan image variants and falls back to a top-level image URL', () => {
    expect(getAnimeImageUrl({
      images: { jpg: { image_url: 'https://cdn.example/small.jpg', large_image_url: 'https://cdn.example/large.jpg' } },
    })).toBe('https://cdn.example/large.jpg')
    expect(getAnimeImageUrl({ images: { jpg: { image_url: 'https://cdn.example/small.jpg' } } }, false))
      .toBe('https://cdn.example/small.jpg')
    expect(getAnimeImageUrl({ image_url: 'https://cdn.example/legacy.jpg' })).toBe('https://cdn.example/legacy.jpg')
    expect(getAnimeImageUrl({ title: 'Missing poster' }))
      .toBe('https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400')
    expect(getAnimeImageUrl({ images: { large: 'https://cdn.example/normalized-large.jpg' } }))
      .toBe('https://cdn.example/normalized-large.jpg')
  })

  it('provides at least 20 typed anime with valid IDs, scores, and images', () => {
    const fallback = getFallbackAnime()
    const fallbackPosterUrls = fallback.map((anime) => anime.images.jpg?.large_image_url)

    expect(fallback.length).toBeGreaterThanOrEqual(20)
    expect(new Set(fallbackPosterUrls).size).toBe(fallback.length)
    for (const anime of fallback) {
      expect(Number.isSafeInteger(anime.id)).toBe(true)
      expect(anime.id).toBeGreaterThan(0)
      expect(anime.score).toBeTypeOf('number')
      expect(anime.images.standard).toBeTypeOf('string')
      expect(anime.images.large).toBeTypeOf('string')
      expect(anime.images.jpg?.image_url).toBeTypeOf('string')
      expect(anime.images.jpg?.image_url).toMatch(/^https:\/\//)
      expect(anime.images.jpg?.large_image_url).toBeTypeOf('string')
      expect(anime.images.jpg?.large_image_url).toMatch(/^https:\/\//)
      expect(anime.genres.length).toBeGreaterThan(0)
      expect(anime.studios.length).toBeGreaterThan(0)
    }

    expect(fallback.find((anime) => anime.title === 'Cowboy Bebop')?.images.jpg?.large_image_url)
      .toBe('https://cdn.myanimelist.net/images/anime/4/19644l.jpg')
    expect(fallback.find((anime) => anime.title === 'Death Note')?.images.jpg?.large_image_url)
      .toBe('https://cdn.myanimelist.net/images/anime/9/9453.jpg')
    expect(fallback.find((anime) => anime.title === 'Attack on Titan')?.images.jpg?.large_image_url)
      .toBe('https://cdn.myanimelist.net/images/anime/10/47347.jpg')
    expect(fallback.find((anime) => anime.title === 'Naruto')?.images.jpg?.large_image_url)
      .toBe('https://cdn.myanimelist.net/images/anime/13/17405.jpg')
    expect(fallback.find((anime) => anime.title === 'Dr. Stone')?.id).toBe(38691)
  })

  it('uses Jikan jpg image URLs when normalizing API anime', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
        data: [{
          mal_id: 42,
          title: 'API Anime',
          images: {
            jpg: {
              image_url: 'https://cdn.example/anime-small.jpg',
              large_image_url: 'https://cdn.example/anime-large.jpg',
            },
          },
          genres: [],
          studios: [],
        }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchTopAnime(1, 1)).resolves.toMatchObject([{
      id: 42,
      image_url: 'https://cdn.example/anime-large.jpg',
      images: {
        standard: 'https://cdn.example/anime-small.jpg',
        large: 'https://cdn.example/anime-large.jpg',
      },
    }])
    expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({
      href: 'https://api.jikan.moe/v4/top/anime?page=1&limit=1',
    }))
  })
})

afterEach(() => vi.unstubAllGlobals())
