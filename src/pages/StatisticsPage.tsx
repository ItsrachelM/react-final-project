import { useEffect, useState } from 'react'
import { fetchTopAnime, getFallbackAnime } from '../services/animeApi'
import type { Anime } from '../types/anime'

export function StatisticsPage() {
  // Keep useful metrics visible immediately while the live catalog refreshes.
  const [anime, setAnime] = useState<Anime[]>(getFallbackAnime)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let active = true
    const loadingTimeout = window.setTimeout(() => {
      if (active) setLoading(false)
    }, 8_000)

    fetchTopAnime()
      .then((results) => {
        // An empty response must not erase the local dataset or leave blank metrics.
        if (active && results.length > 0) setAnime(results)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to refresh statistics.')
        }
      })
      .finally(() => {
        window.clearTimeout(loadingTimeout)
        if (active) setLoading(false)
      })

    return () => {
      active = false
      window.clearTimeout(loadingTimeout)
    }
  }, [requestVersion])

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
  const totalEpisodes = anime.reduce((total, item) => total + (item.episodes ?? 0), 0)

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Catalog overview</p>
        <h1>Statistics</h1>
        <p>Metrics summarize the currently available anime catalog.</p>
      </div>
      {loading && <p className="status-message" role="status">Showing local statistics while the catalog refreshes...</p>}
      {error && (
        <div className="status-message error-message" role="alert">
          <p>{error} Local statistics are still available.</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setLoading(true)
              setError(null)
              setRequestVersion((version) => version + 1)
            }}
          >
            Try again
          </button>
        </div>
      )}
      <div className="stats-grid">
        <article className="stat-card"><span>Total series</span><strong>{anime.length}</strong></article>
        <article className="stat-card"><span>Average score</span><strong>{averageScore === null ? '—' : averageScore.toFixed(2)}</strong></article>
        <article className="stat-card"><span>Total episodes</span><strong>{totalEpisodes.toLocaleString()}</strong></article>
      </div>
      <h2>Most common genres</h2>
      {topGenres.length === 0 ? (
        <p className="status-message">No genre data is available.</p>
      ) : (
        <ol className="genre-list">
          {topGenres.map(([genre, count]) => <li key={genre}><span>{genre}</span><strong>{count}</strong></li>)}
        </ol>
      )}
    </section>
  )
}
