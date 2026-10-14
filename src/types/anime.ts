export interface AnimeImageSet {
  standard: string | null
  large: string | null
  jpg?: {
    image_url: string
    large_image_url: string
  }
}

export interface AnimeGenre {
  id: number
  name: string
}

export interface AnimeStudio {
  id: number
  name: string
}

export interface Anime {
  id: number
  mal_id?: number
  title: string
  image_url?: string | null
  synopsis: string | null
  episodes: number | null
  score: number | null
  images: AnimeImageSet
  genres: AnimeGenre[]
  studios: AnimeStudio[]
  trailer_url: string | null
}

export interface AnimeApiResponse<T> {
  data: T
}
