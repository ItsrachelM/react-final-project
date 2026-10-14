import { AnimeCard } from '../components/AnimeCard'
import { Link } from 'react-router-dom'
import { useFavorites } from '../context/FavoritesContext'

export function FavoritesPage() {
  const { favorites } = useFavorites()

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">Your personal collection</p>
        <h1>Favorites</h1>
        <p>{favorites.length ? `${favorites.length} anime series saved.` : 'Keep your favorite series close at hand.'}</p>
      </div>
      {favorites.length ? (
        <div className="anime-grid">
          {favorites.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">♡</span>
          <h2>Your collection starts here</h2>
          <p>Tap the heart on any anime poster to save it to your favorites.</p>
          <Link className="primary-button" to="/">Explore anime</Link>
        </div>
      )}
    </section>
  )
}
