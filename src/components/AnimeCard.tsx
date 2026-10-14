import { Link } from 'react-router-dom'
import type { Anime } from '../types/anime'

interface AnimeCardProps {
  anime: Anime
}

export function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <article className="anime-card">
      <Link className="anime-card-link" to={`/items/${anime.id}`}>
        {anime.images.standard ? (
          <img className="anime-card-image" src={anime.images.standard} alt="" loading="lazy" />
        ) : (
          <div className="anime-card-image image-placeholder" aria-hidden="true">
            No image
          </div>
        )}
        <div className="anime-card-content">
          <h2>{anime.title}</h2>
          <p className="anime-card-genres">
            {anime.genres.length > 0 ? anime.genres.map((genre) => genre.name).join(' · ') : 'Genres unavailable'}
          </p>
          <p className="anime-score">
            Score: {anime.score === null ? 'Not rated' : anime.score.toFixed(1)}
          </p>
        </div>
      </Link>
    </article>
  )
}
