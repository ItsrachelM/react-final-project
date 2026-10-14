import { Link } from 'react-router-dom'
import { getAnimeFallbackImage, getAnimeImageUrl } from '../services/animeApi'
import { FavoriteButton } from './FavoriteButton'
import type { Anime } from '../types/anime'

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <article className="anime-card">
      <Link className="anime-card-link" to={`/items/${anime.id}`}>
        <div className="anime-poster">
          <img
            className="anime-card-image"
            src={anime.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || getAnimeImageUrl(anime)}
            alt={`${anime.title} poster`}
            loading="lazy"
            onError={(event) => {
              const image = event.currentTarget
              image.onerror = null
              image.src = getAnimeFallbackImage(anime.title)
            }}
          />
          <span className="score-badge">
            <span aria-hidden="true">★</span> {anime.score === null ? '—' : anime.score.toFixed(1)}
          </span>
        </div>
        <div className="anime-card-content">
          <h2>{anime.title}</h2>
          <div className="genre-tags">
            {anime.genres.slice(0, 3).map((genre) => (
              <span className="genre-tag" key={genre.id}>{genre.name}</span>
            ))}
            {anime.genres.length === 0 && <span className="genre-tag">Genre unavailable</span>}
          </div>
        </div>
      </Link>
      <FavoriteButton anime={anime} className="favorite-toggle-card" />
    </article>
  )
}
