import { Link, useParams } from 'react-router-dom'
import { getFallbackAnime } from '../services/animeApi'

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const anime = getFallbackAnime().find(
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
      <div className="detail-layout">
        {anime.images.large && (
          <img className="detail-image" src={anime.images.large} alt={`${anime.title} poster`} />
        )}
        <div>
          <p className="eyebrow">Anime details</p>
          <h1>{anime.title}</h1>
          <dl className="detail-facts">
            <div><dt>Score</dt><dd>{anime.score === null ? 'Not rated' : anime.score.toFixed(1)}</dd></div>
            <div><dt>Episodes</dt><dd>{anime.episodes ?? 'Unknown'}</dd></div>
            <div><dt>Genres</dt><dd>{anime.genres.map((genre) => genre.name).join(', ') || 'Unavailable'}</dd></div>
            <div><dt>Studios</dt><dd>{anime.studios.map((studio) => studio.name).join(', ') || 'Unavailable'}</dd></div>
          </dl>
          <h2>Synopsis</h2>
          <p className="synopsis">{anime.synopsis || 'Synopsis unavailable.'}</p>
          {anime.trailer_url && (
            <a className="primary-button trailer-link" href={anime.trailer_url} target="_blank" rel="noreferrer">
              Watch trailer
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
