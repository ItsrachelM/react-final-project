import { useEffect, useMemo, useState } from 'react'
import { AnimeCard } from '../components/AnimeCard'
import { fetchTopAnime, getFallbackAnime } from '../services/animeApi'
import type { Anime } from '../types/anime'
import { filterAnime } from '../utils/animeFilters'

export function HomePage() {
  const [anime, setAnime] = useState<Anime[]>(getFallbackAnime)
  const [query, setQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [requestVersion, setRequestVersion] = useState(0)

  useEffect(() => {
    let active = true

    fetchTopAnime()
      .then((results) => {
        if (active) setAnime(results)
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : 'Unable to load anime.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [requestVersion])

  const genres = useMemo(
    () => [...new Set(anime.flatMap((item) => item.genres.map((genre) => genre.name)))].sort(),
    [anime],
  )
  const filteredAnime = filterAnime(anime, query, genreFilter)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  function handleRetry() {
    setLoading(true)
    setError(null)
    setRequestVersion((version) => version + 1)
  }

  return (
    <section className="home-page">
      <div className="page-heading">
        <p className="eyebrow">Find your next series</p>
        <h1>Anime explorer</h1>
        <p>Browse top anime, search the catalog, and explore each series.</p>
      </div>

      <form className="catalog-controls" onSubmit={handleSearch}>
        <label className="search-field">
          <span>Search anime</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try a title..."
          />
        </label>
        <label>
          <span>Genre</span>
          <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
            <option value="">All genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
        <button className="primary-button" type="submit">
          Search
        </button>
      </form>

      {loading && anime.length === 0 && <p className="status-message" role="status">Loading anime...</p>}
      {loading && anime.length > 0 && <p className="status-message" role="status">Refreshing anime catalog...</p>}
      {error && (
        <div className="status-message error-message" role="alert">
          <p>{error}</p>
          <button className="secondary-button" type="button" onClick={handleRetry}>
            Try again
          </button>
        </div>
      )}
      {!error && filteredAnime.length > 0 && (
        <div className="anime-grid">
          {filteredAnime.map((item) => <AnimeCard key={item.id} anime={item} />)}
        </div>
      )}
      {!loading && !error && filteredAnime.length === 0 && (
        <p className="status-message">No anime match your search and filters.</p>
      )}
    </section>
  )
}
