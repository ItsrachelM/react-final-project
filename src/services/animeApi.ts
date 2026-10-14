import type { Anime, AnimeApiResponse } from '../types/anime'

const API_BASE_URL = 'https://api.jikan.moe/v4'
const MIN_REQUEST_INTERVAL_MS = 1_000
const RETRY_DELAY_MS = 1_000
const MAX_RETRIES = 2

function fallbackImages(title: string): Anime['images'] {
  const safeTitle = title
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><rect width="600" height="840" fill="#312044"/><text x="300" y="400" fill="#fff" font-family="sans-serif" font-size="36" text-anchor="middle">${safeTitle}</text><text x="300" y="460" fill="#d8c4ef" font-family="sans-serif" font-size="24" text-anchor="middle">Offline catalog</text></svg>`
  const image = `data:image/svg+xml,${encodeURIComponent(svg)}`
  return { standard: image, large: image }
}

const FALLBACK_ANIME: Anime[] = [
  {
    id: 1,
    title: 'Cowboy Bebop',
    synopsis: 'A crew of bounty hunters travels through space, taking on dangerous jobs while confronting the histories that follow them.',
    episodes: 26,
    score: 8.75,
    images: fallbackImages('Cowboy Bebop'),
    genres: [{ id: 1, name: 'Action' }, { id: 24, name: 'Sci-Fi' }],
    studios: [{ id: 14, name: 'Sunrise' }],
    trailer_url: null,
  },
  {
    id: 1535,
    title: 'Death Note',
    synopsis: 'A student discovers a notebook with the power to kill anyone whose name is written in it, setting off a battle of wits.',
    episodes: 37,
    score: 8.62,
    images: fallbackImages('Death Note'),
    genres: [{ id: 41, name: 'Suspense' }, { id: 37, name: 'Supernatural' }],
    studios: [{ id: 11, name: 'Madhouse' }],
    trailer_url: null,
  },
  {
    id: 5114,
    title: 'Fullmetal Alchemist: Brotherhood',
    synopsis: 'Two brothers search for the Philosopher’s Stone after a forbidden alchemical ritual costs them dearly.',
    episodes: 64,
    score: 9.1,
    images: fallbackImages('Fullmetal Alchemist: Brotherhood'),
    genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 8, name: 'Drama' }],
    studios: [{ id: 4, name: 'Bones' }],
    trailer_url: null,
  },
  {
    id: 9253,
    title: 'Steins;Gate',
    synopsis: 'A group of friends accidentally discovers a way to send messages to the past, with consequences that grow increasingly serious.',
    episodes: 24,
    score: 9.07,
    images: fallbackImages('Steins;Gate'),
    genres: [{ id: 24, name: 'Sci-Fi' }, { id: 40, name: 'Psychological' }, { id: 41, name: 'Suspense' }],
    studios: [{ id: 11, name: 'White Fox' }],
    trailer_url: null,
  },
  {
    id: 21,
    title: 'One Piece',
    synopsis: 'A determined young pirate gathers a crew and sails toward the Grand Line in search of the legendary One Piece.',
    episodes: 1100,
    score: 8.7,
    images: fallbackImages('One Piece'),
    genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 10, name: 'Fantasy' }],
    studios: [{ id: 18, name: 'Toei Animation' }],
    trailer_url: null,
  },
  {
    id: 20,
    title: 'Naruto',
    synopsis: 'An energetic young ninja works toward recognition and dreams of becoming the leader of his village.',
    episodes: 220,
    score: 8.0,
    images: fallbackImages('Naruto'),
    genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 17, name: 'Martial Arts' }],
    studios: [{ id: 7, name: 'Pierrot' }],
    trailer_url: null,
  },
  {
    id: 38000,
    title: 'Demon Slayer: Kimetsu no Yaiba',
    synopsis: 'After a demon attack devastates his family, a kind-hearted boy sets out to protect his remaining sister and find a cure.',
    episodes: 26,
    score: 8.5,
    images: fallbackImages('Demon Slayer: Kimetsu no Yaiba'),
    genres: [{ id: 1, name: 'Action' }, { id: 2, name: 'Adventure' }, { id: 10, name: 'Fantasy' }],
    studios: [{ id: 43, name: 'ufotable' }],
    trailer_url: null,
  },
  {
    id: 52991,
    title: 'Frieren: Beyond Journey’s End',
    synopsis: 'After an age-defining adventure ends, an elven mage begins a quieter journey to understand the people she once traveled with.',
    episodes: 28,
    score: 9.3,
    images: fallbackImages('Frieren: Beyond Journey’s End'),
    genres: [{ id: 2, name: 'Adventure' }, { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }],
    studios: [{ id: 11, name: 'Madhouse' }],
    trailer_url: null,
  },
]

type JsonObject = Record<string, unknown>

let lastRequestAt = 0
let requestQueue = Promise.resolve()

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
  const response = await fetchWithRetry(url)
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

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, duration))
}

async function scheduleFetch(url: URL): Promise<Response> {
  const scheduledRequest = requestQueue.then(async () => {
    const delay = Math.max(0, MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt))
    if (delay > 0) await wait(delay)

    lastRequestAt = Date.now()
    return fetch(url)
  })

  requestQueue = scheduledRequest.then(() => undefined, () => undefined)
  return scheduledRequest
}

async function fetchWithRetry(url: URL): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await scheduleFetch(url)
      if (response.status !== 429 && response.status < 500) return response
      if (attempt === MAX_RETRIES) return response
    } catch (error: unknown) {
      if (!(error instanceof TypeError)) throw error
      if (attempt === MAX_RETRIES) {
        throw new AnimeApiError(
          'Unable to reach the Jikan API. Check your internet connection, then try again.',
        )
      }
    }

    await wait(RETRY_DELAY_MS * (attempt + 1))
  }

  throw new AnimeApiError('Unable to reach the Jikan API. Please try again.')
}

function normalizeAnimeList(data: unknown): Anime[] {
  if (!Array.isArray(data)) {
    throw new AnimeApiError('Jikan API returned an invalid anime list.')
  }

  return data.map(normalizeAnime)
}

function getFallbackPage(page: number, limit: number): Anime[] {
  const start = (page - 1) * limit
  return FALLBACK_ANIME.slice(start, start + limit)
}

export function getFallbackAnime(): Anime[] {
  return [...FALLBACK_ANIME]
}

function getOfflineAnime(id: number): Anime {
  return FALLBACK_ANIME.find((anime) => anime.id === id) ?? {
    id,
    title: `Anime #${id} (offline)`,
    synopsis: 'Detailed information for this anime is unavailable while the Jikan API cannot be reached.',
    episodes: null,
    score: null,
    images: fallbackImages(`Anime #${id} (offline)`),
    genres: [],
    studios: [],
    trailer_url: null,
  }
}

export function fetchTopAnime(page = 1, limit = 25): Promise<Anime[]> {
  const url = new URL(`${API_BASE_URL}/top/anime`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))

  return fetchData(url, normalizeAnimeList).catch(() => getFallbackPage(page, limit))
}

export function fetchAnimeById(id: string | number): Promise<Anime> {
  const numericId = Number(id)
  if (!Number.isSafeInteger(numericId) || numericId < 1) {
    throw new AnimeApiError('Anime ID must be a positive integer.')
  }

  const url = new URL(`${API_BASE_URL}/anime/${numericId}/full`)
  return fetchData(url, normalizeAnime).catch(() => getOfflineAnime(numericId))
}

export function searchAnime(query: string): Promise<Anime[]> {
  const trimmedQuery = query.trim()
  if (!trimmedQuery) return Promise.resolve([])

  const url = new URL(`${API_BASE_URL}/anime`)
  url.searchParams.set('q', trimmedQuery)
  return fetchData(url, normalizeAnimeList).catch(() => {
    const normalizedQuery = trimmedQuery.toLocaleLowerCase()
    return FALLBACK_ANIME.filter((anime) => anime.title.toLocaleLowerCase().includes(normalizedQuery))
  })
}
