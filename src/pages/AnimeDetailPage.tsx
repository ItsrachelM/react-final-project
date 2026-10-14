import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchAnimeById } from '../services/animeApi'
import type { Anime } from '../types/anime'

export function AnimeDetailPage() {
  const { id } = useParams()
  const [result, setResult] = useState<{
    id: string
    anime: Anime | null
    error: string | null
  } | null>(null)

  useEffect(() => {
    let active = true

    if (!id) return

    Promise.resolve()
      .then(() => fetchAnimeById(id))
      .then((result) => {
        if (active) setResult({ id, anime: result, error: null })
      })
      .catch((requestError: unknown) => {
        if (active) {
          setResult({
            id,
            anime: null,
            error: requestError instanceof Error ? requestError.message : 'Unable to load this anime.',
          })
        }
      })

    return () => {
      active = false
    }
  }, [id])

  if (!id || !result || result.id !== id) {
    return <p className="status-message" role="status">Loading anime details...</p>
  }
  if (result.error) return <p className="status-message error-message" role="alert">{result.error}</p>
  const anime = result.anime
  if (!anime) return <p className="status-message" role="alert">Anime not found.</p>

  return (
    <article className="detail-page">
      <Link className="back-link" to="/">← Back to explore</Link>
      <div className="detail-layout">
        {anime.images.large && <img className="detail-image" src={anime.images.large} alt="" />}
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
