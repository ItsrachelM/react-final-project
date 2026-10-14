import type { Anime, AnimeApiResponse } from '../types/anime'

const API_BASE_URL = 'https://api.jikan.moe/v4'

type JsonObject = Record<string, unknown>

export class AnimeApiError extends Error {
  readonly status: number | null

  constructor(
    message: string,
    status: number | null = null,
  ) {
    super(message)
    this.name = 'AnimeApiError'
    this.status = status
  }
}

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

function readImageUrl(images: unknown, format: 'image_url' | 'large_image_url'): string | null {
  if (!isObject(images)) return null

  for (const imageFormat of ['jpg', 'webp']) {
    const imageSet = images[imageFormat]
    if (!isObject(imageSet)) continue

    const url = readString(imageSet[format])
    if (url) return url
  }

  return null
}

function readNamedItems(value: unknown): Array<{ id: number; name: string }> {
  if (!Array.isArray(value)) return []

  return value.flatMap((item): Array<{ id: number; name: string }> => {
    if (!isObject(item) || typeof item.mal_id !== 'number' || typeof item.name !== 'string') {
      return []
    }

    return [{ id: item.mal_id, name: item.name }]
  })
}

function normalizeAnime(value: unknown): Anime {
  if (
    !isObject(value) ||
    typeof value.mal_id !== 'number' ||
    typeof value.title !== 'string'
  ) {
    throw new AnimeApiError('Jikan API returned an invalid anime record.')
  }

  const trailer = isObject(value.trailer) ? value.trailer : null

  return {
    id: value.mal_id,
    title: value.title,
    synopsis: readString(value.synopsis),
    episodes: typeof value.episodes === 'number' ? value.episodes : null,
    score: typeof value.score === 'number' ? value.score : null,
    images: {
      standard: readImageUrl(value.images, 'image_url'),
      large: readImageUrl(value.images, 'large_image_url'),
    },
    genres: readNamedItems(value.genres),
    studios: readNamedItems(value.studios),
    trailer_url: trailer ? readString(trailer.url) : null,
  }
}

async function fetchData<T>(url: URL, normalize: (data: unknown) => T): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new AnimeApiError(
      `Jikan API request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`,
      response.status,
    )
  }

  let payload: unknown
  try {
    payload = await response.json()
  } catch {
    throw new AnimeApiError('Jikan API returned an invalid JSON response.', response.status)
  }

  if (!isObject(payload) || !('data' in payload)) {
    throw new AnimeApiError('Jikan API returned an invalid response structure.', response.status)
  }

  const apiResponse: AnimeApiResponse<unknown> = { data: payload.data }
  return normalize(apiResponse.data)
}

function normalizeAnimeList(data: unknown): Anime[] {
  if (!Array.isArray(data)) {
    throw new AnimeApiError('Jikan API returned an invalid anime list.')
  }

  return data.map(normalizeAnime)
}

export function fetchTopAnime(page = 1, limit = 25): Promise<Anime[]> {
  const url = new URL(`${API_BASE_URL}/top/anime`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))

  return fetchData(url, normalizeAnimeList)
}

export function fetchAnimeById(id: string | number): Promise<Anime> {
  const numericId = Number(id)
  if (!Number.isSafeInteger(numericId) || numericId < 1) {
    throw new AnimeApiError('Anime ID must be a positive integer.')
  }

  const url = new URL(`${API_BASE_URL}/anime/${numericId}/full`)
  return fetchData(url, normalizeAnime)
}

export function searchAnime(query: string): Promise<Anime[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return Promise.resolve([])

  const url = new URL(`${API_BASE_URL}/anime`)
  url.searchParams.set('q', trimmedQuery)
  return fetchData(url, normalizeAnimeList)
}
