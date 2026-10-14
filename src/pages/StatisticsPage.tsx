import { useEffect, useState } from 'react'
import { fetchTopAnime } from '../services/animeApi'
import type { Anime } from '../types/anime'

export function StatisticsPage() {
  const [anime, setAnime] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    fetchTopAnime()
      .then((results) => {
        if (active) setAnime(results)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load statistics.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const scoredAnime = anime.filter((item) => item.score !== null)
  const averageScore = scoredAnime.length
    ? scoredAnime.reduce((total, item) => total + (item.score ?? 0), 0) / scoredAnime.length
    : null
  const genreCounts = anime.flatMap((item) => item.genres.map((genre) => genre.name))
    .reduce<Record<string, number>>((counts, genre) => {
      counts[genre] = (counts[genre] ?? 0) + 1
      return counts
    }, {})
  const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Catalog overview</p>
        <h1>Statistics</h1>
        <p>Metrics summarize the currently loaded top anime results.</p>
      </div>
      {loading && <p className="status-message" role="status">Loading statistics...</p>}
      {error && <p className="status-message error-message" role="alert">{error}</p>}
      {!loading && !error && (
        <>
          <div className="stats-grid">
            <article className="stat-card"><span>Anime loaded</span><strong>{anime.length}</strong></article>
            <article className="stat-card"><span>Average score</span><strong>{averageScore === null ? '—' : averageScore.toFixed(2)}</strong></article>
          </div>
          <h2>Most common genres</h2>
          {topGenres.length === 0 ? (
            <p className="status-message">No genre data is available.</p>
          ) : (
            <ol className="genre-list">
              {topGenres.map(([genre, count]) => <li key={genre}><span>{genre}</span><strong>{count}</strong></li>)}
            </ol>
          )}
        </>
      )}
    </section>
  )
}
