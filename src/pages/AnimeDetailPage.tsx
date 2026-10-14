import { Link, useParams } from 'react-router-dom'
import { getAnimeFallbackImage, getAnimeImageUrl, getKnownAnime } from '../services/animeApi'
import { FavoriteButton } from '../components/FavoriteButton'

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const anime = getKnownAnime().find(
    (item) => String(item.mal_id || item.id) === id,
  )

  if (!anime) {
    return (
      <section className="page-heading">
        <p className="eyebrow">Anime details</p>
        <h1>Anime not found</h1>
        <p>This anime is not available in the local catalog.</p>
        <Link className="primary-button" to="/">Back to explore</Link>
      </section>
    )
  }

  return (
    <article className="detail-page">
      <Link className="back-link" to="/">← Back to explore</Link>
      <div className="detail-card">
        <div className="detail-layout">
          <div className="detail-poster-wrap">
            <img
              className="detail-image"
              src={anime.image_url || anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || getAnimeImageUrl(anime)}
              alt={`${anime.title} poster`}
              onError={(event) => {
                const image = event.currentTarget
                image.onerror = null
                image.src = getAnimeFallbackImage(anime.title)
              }}
            />
            {anime.score !== null && (
              <span className="detail-score-badge"><span aria-hidden="true">★</span> {anime.score.toFixed(1)}</span>
            )}
          </div>
          <div className="detail-content">
          <p className="eyebrow">Anime details</p>
          <h1>{anime.title}</h1>
          <FavoriteButton anime={anime} className="favorite-toggle-detail" />
          <div className="detail-badges">
            <span className="detail-badge">
              <span aria-hidden="true">▣</span> {anime.episodes === null ? 'Episode count unavailable' : `${anime.episodes} episodes`}
            </span>
            <span className="detail-badge">
              <span aria-hidden="true">★</span> {anime.score === null ? 'Not rated' : `Score ${anime.score.toFixed(1)}`}
            </span>
          </div>
          <section className="detail-section" aria-labelledby="genres-heading">
            <h2 id="genres-heading">Genres</h2>
            <div className="genre-tags detail-tags">
              {anime.genres.length > 0
                ? anime.genres.map((genre) => <span className="genre-tag" key={genre.id}>{genre.name}</span>)
                : <span className="muted-detail">Unavailable</span>}
            </div>
          </section>
          <section className="detail-section" aria-labelledby="studios-heading">
            <h2 id="studios-heading">Studios</h2>
            <p className="studio-list">{anime.studios.map((studio) => studio.name).join(' · ') || 'Unavailable'}</p>
          </section>
          <section className="synopsis-card" aria-labelledby="synopsis-heading">
            <h2 id="synopsis-heading">Synopsis</h2>
            <p className="synopsis">{anime.synopsis || 'Synopsis unavailable.'}</p>
          </section>
          {anime.trailer_url && (
            <a className="primary-button trailer-link" href={anime.trailer_url} target="_blank" rel="noreferrer">
              Watch trailer
            </a>
          )}
          </div>
        </div>
      </div>
    </article>
  )
}
