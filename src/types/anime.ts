export interface AnimeImageSet {
  standard: string | null
  large: string | null
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
  title: string
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
