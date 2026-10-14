import type { Anime, AnimeApiResponse } from '../types/anime'

const API_BASE_URL = 'https://api.jikan.moe/v4'
const MIN_REQUEST_INTERVAL_MS = 1_000
const RETRY_DELAY_MS = 1_000
const MAX_RETRIES = 2
const FALLBACK_POSTER_URL = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400'
const FALLBACK_POSTERS: Record<number, string> = {
  1: 'https://cdn.myanimelist.net/images/anime/4/19644l.jpg',
  1535: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
  5114: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
  9253: 'https://cdn.myanimelist.net/images/anime/1935/127974.jpg',
  21: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg',
  20: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
  38000: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
  52991: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
  16498: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
  11061: 'https://cdn.myanimelist.net/images/anime/1337/99013.jpg',
  40748: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
  31964: 'https://cdn.myanimelist.net/images/anime/10/78745.jpg',
  20583: 'https://cdn.myanimelist.net/images/anime/7/64293.jpg',
  22319: 'https://cdn.myanimelist.net/images/anime/1498/134443.jpg',
  32182: 'https://cdn.myanimelist.net/images/anime/5/79183.jpg',
  32281: 'https://cdn.myanimelist.net/images/anime/5/87048.jpg',
  199: 'https://cdn.myanimelist.net/images/anime/6/79597.jpg',
  1575: 'https://cdn.myanimelist.net/images/anime/1032/135088.jpg',
  33352: 'https://cdn.myanimelist.net/images/anime/1795/95088.jpg',
  37999: 'https://cdn.myanimelist.net/images/anime/1295/106551.jpg',
  44511: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
  269: 'https://cdn.myanimelist.net/images/anime/7/3791.jpg',
  813: 'https://cdn.myanimelist.net/images/anime/1277/142022.jpg',
  50265: 'https://cdn.myanimelist.net/images/anime/1441/122795.jpg',
  38691: 'https://cdn.myanimelist.net/images/anime/6/97268.jpg',
}

function createPlaceholderImage(title: string): string {
  const safeTitle = title
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="840" viewBox="0 0 600 840"><rect width="600" height="840" fill="#312044"/><text x="300" y="400" fill="#fff" font-family="sans-serif" font-size="36" text-anchor="middle">${safeTitle}</text><text x="300" y="460" fill="#d8c4ef" font-family="sans-serif" font-size="24" text-anchor="middle">Offline catalog</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function fallbackImages(title: string, id?: number): Anime['images'] {
  const image = FALLBACK_POSTERS[id ?? -1] ?? createPlaceholderImage(title)
  return {
    standard: image,
    large: image,
    jpg: { image_url: image, large_image_url: image },
  }
}

/** Selects the best available Jikan image URL, including legacy/top-level payloads. */
export function getAnimeImageUrl(item: unknown, preferLarge = true): string {
  if (!isObject(item)) return FALLBACK_POSTER_URL

  const images = item.images
  const jpg = isObject(images) && isObject(images.jpg) ? images.jpg : null
  const webp = isObject(images) && isObject(images.webp) ? images.webp : null
  const standard = isObject(images) ? images.standard : null
  const large = isObject(images) ? images.large : null
  const candidates = preferLarge
    ? [jpg?.large_image_url, jpg?.image_url, item.image_url, large, webp?.large_image_url, webp?.image_url, standard]
    : [jpg?.image_url, jpg?.large_image_url, item.image_url, standard, webp?.image_url, webp?.large_image_url, large]
  const url = candidates.find((candidate): candidate is string => typeof candidate === 'string' && candidate.length > 0)
  return url ?? FALLBACK_POSTER_URL
}

export function getAnimeFallbackImage(title: string): string {
  return createPlaceholderImage(title)
}

function createFallbackAnime(
  id: number,
  title: string,
  synopsis: string,
  episodes: number,
  score: number,
  genreNames: string[],
  studio: string,
): Anime {
  return {
    id,
    title,
    synopsis,
    episodes,
    score,
    images: fallbackImages(title, id),
    genres: genreNames.map((name, index) => ({ id: 100 + index, name })),
    studios: [{ id: 100, name: studio }],
    trailer_url: null,
  }
}

const FALLBACK_ANIME: Anime[] = [
  {
    id: 1,
    title: 'Cowboy Bebop',
    synopsis: 'A crew of bounty hunters travels through space, taking on dangerous jobs while confronting the histories that follow them.',
    episodes: 26,
    score: 8.75,
    images: fallbackImages('Cowboy Bebop', 1),
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
    images: fallbackImages('Death Note', 1535),
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
    images: fallbackImages('Fullmetal Alchemist: Brotherhood', 5114),
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
    images: fallbackImages('Steins;Gate', 9253),
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
    images: fallbackImages('One Piece', 21),
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
    images: fallbackImages('Naruto', 20),
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
    images: fallbackImages('Demon Slayer: Kimetsu no Yaiba', 38000),
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
    images: fallbackImages('Frieren: Beyond Journey’s End', 52991),
    genres: [{ id: 2, name: 'Adventure' }, { id: 8, name: 'Drama' }, { id: 10, name: 'Fantasy' }],
    studios: [{ id: 11, name: 'Madhouse' }],
    trailer_url: null,
  },
  createFallbackAnime(16498, 'Attack on Titan', 'Humanity fights for survival behind enormous walls after giant humanoid Titans breach its defenses.', 25, 8.5, ['Action', 'Drama', 'Fantasy'], 'Wit Studio'),
  createFallbackAnime(11061, 'Hunter x Hunter', 'A young adventurer sets out to become a Hunter and find the father he has never known.', 148, 9.0, ['Action', 'Adventure', 'Fantasy'], 'Madhouse'),
  createFallbackAnime(40748, 'Jujutsu Kaisen', 'A high school student joins a secret society of sorcerers after becoming host to a powerful curse.', 24, 8.6, ['Action', 'Supernatural'], 'MAPPA'),
  createFallbackAnime(31964, 'My Hero Academia', 'In a world where superpowers are common, a determined boy pursues his dream of becoming a hero.', 13, 7.9, ['Action', 'School', 'Superhero'], 'Bones'),
  createFallbackAnime(20583, 'Haikyu!!', 'A short but spirited volleyball player joins his high school team and aims for the national tournament.', 25, 8.4, ['Sports', 'Drama', 'School'], 'Production I.G'),
  createFallbackAnime(22319, 'Tokyo Ghoul', 'A college student is drawn into the hidden world of flesh-eating ghouls after a life-changing encounter.', 12, 7.8, ['Action', 'Horror', 'Supernatural'], 'Pierrot'),
  createFallbackAnime(32182, 'Mob Psycho 100', 'A quiet middle schooler with extraordinary psychic abilities tries to live an ordinary life.', 12, 8.5, ['Action', 'Comedy', 'Supernatural'], 'Bones'),
  createFallbackAnime(32281, 'Your Name.', 'Two teenagers who have never met begin mysteriously swapping bodies across distance and time.', 1, 8.8, ['Romance', 'Drama', 'Supernatural'], 'CoMix Wave Films'),
  createFallbackAnime(199, 'Spirited Away', 'A young girl enters a mysterious spirit world and must find courage to rescue her parents.', 1, 8.8, ['Adventure', 'Fantasy'], 'Studio Ghibli'),
  createFallbackAnime(1575, 'Code Geass: Lelouch of the Rebellion', 'An exiled prince gains a power of absolute command and leads a rebellion against an empire.', 25, 8.7, ['Action', 'Drama', 'Sci-Fi'], 'Sunrise'),
  createFallbackAnime(33352, 'Violet Evergarden', 'A former child soldier becomes a letter writer and learns to understand the emotions she once could not express.', 13, 8.7, ['Drama', 'Fantasy'], 'Kyoto Animation'),
  createFallbackAnime(37999, 'Kaguya-sama: Love Is War', 'Two brilliant student council leaders turn romance into a battle of strategy and pride.', 12, 8.4, ['Comedy', 'Romance', 'School'], 'A-1 Pictures'),
  createFallbackAnime(44511, 'Chainsaw Man', 'A young devil hunter is resurrected with chainsaw powers and pulled into a dangerous government unit.', 12, 8.5, ['Action', 'Fantasy', 'Horror'], 'MAPPA'),
  createFallbackAnime(269, 'Bleach', 'A teenager gains the powers of a Soul Reaper and takes on the task of protecting the living from spirits.', 366, 8.0, ['Action', 'Adventure', 'Supernatural'], 'Pierrot'),
  createFallbackAnime(813, 'Dragon Ball Z', 'A martial artist and his friends defend Earth from increasingly powerful foes from across the universe.', 291, 8.2, ['Action', 'Adventure', 'Martial Arts'], 'Toei Animation'),
  createFallbackAnime(50265, 'Spy x Family', 'A master spy builds a pretend family for a mission, unaware that his new wife and daughter have secrets of their own.', 12, 8.5, ['Action', 'Comedy', 'Family'], 'Wit Studio'),
  createFallbackAnime(38691, 'Dr. Stone', 'A teenage science prodigy wakes in a world where humanity has been turned to stone and sets out to rebuild civilization.', 24, 8.3, ['Adventure', 'Sci-Fi'], 'TMS Entertainment'),
]

type JsonObject = Record<string, unknown>

let lastRequestAt = 0
let requestQueue = Promise.resolve()
let cachedAnime: Anime[] = []

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
  const generatedImage = fallbackImages(value.title, value.mal_id)
  const standardImage = getAnimeImageUrl(value, false)
  const largeImage = getAnimeImageUrl(value, true)

  return {
    id: value.mal_id,
    title: value.title,
    synopsis: readString(value.synopsis),
    episodes: typeof value.episodes === 'number' ? value.episodes : null,
    score: typeof value.score === 'number' ? value.score : null,
    image_url: largeImage || standardImage,
    images: {
      standard: standardImage || largeImage || generatedImage.standard,
      large: largeImage || standardImage || generatedImage.large,
      jpg: {
        image_url: standardImage || largeImage || generatedImage.standard || '',
        large_image_url: largeImage || standardImage || generatedImage.large || '',
      },
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

export function getKnownAnime(): Anime[] {
  const animeById = new Map(FALLBACK_ANIME.map((anime) => [anime.id, anime]))
  for (const anime of cachedAnime) animeById.set(anime.id, anime)
  return [...animeById.values()]
}

function getOfflineAnime(id: number): Anime {
  return FALLBACK_ANIME.find((anime) => anime.id === id) ?? {
    id,
    title: `Anime #${id} (offline)`,
    synopsis: 'Detailed information for this anime is unavailable while the Jikan API cannot be reached.',
    episodes: null,
    score: null,
    images: fallbackImages(`Anime #${id} (offline)`, id),
    genres: [],
    studios: [],
    trailer_url: null,
  }
}

export function fetchTopAnime(page = 1, limit = 25): Promise<Anime[]> {
  const url = new URL(`${API_BASE_URL}/top/anime`)
  url.searchParams.set('page', String(page))
  url.searchParams.set('limit', String(limit))

  return fetchData(url, normalizeAnimeList)
    .then((anime) => {
      cachedAnime = anime
      return anime
    })
    .catch((error: unknown) => {
      console.warn('[animeApi] Failed to load top anime; using local fallback.', error)
      const anime = getFallbackPage(page, limit)
      cachedAnime = anime
      return anime
    })
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
