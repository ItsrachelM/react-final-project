import type { Anime } from '../types/anime'
import { useFavorites } from '../context/FavoritesContext'

export function FavoriteButton({ anime, className = '' }: { anime: Anime; className?: string }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(anime.id)

  return (
    <button
      className={`favorite-toggle ${favorite ? 'is-favorite' : ''} ${className}`.trim()}
      type="button"
      aria-label={favorite ? `Remove ${anime.title} from favorites` : `Add ${anime.title} to favorites`}
      aria-pressed={favorite}
      title={favorite ? 'Remove from favorites' : 'Add to favorites'}
      onClick={() => toggleFavorite(anime)}
    >
      <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
    </button>
  )
}
