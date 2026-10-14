import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Anime } from '../types/anime'

const FAVORITES_STORAGE_KEY = 'anime-catalog-favorites'

interface FavoritesContextValue {
  favorites: Anime[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (anime: Anime) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function readStoredFavorites(): Anime[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    if (!stored) return []

    const parsed: unknown = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []

    return parsed.filter((item): item is Anime =>
      typeof item === 'object' && item !== null &&
      typeof item.id === 'number' && typeof item.title === 'string' &&
      Array.isArray(item.genres) && Array.isArray(item.studios) &&
      typeof item.images === 'object' && item.images !== null &&
      (typeof item.score === 'number' || item.score === null),
    )
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Anime[]>(readStoredFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // The current session can still use favorites if browser storage is unavailable.
    }
  }, [favorites])

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    isFavorite: (id) => favorites.some((anime) => anime.id === id),
    toggleFavorite: (anime) => {
      setFavorites((current) => current.some((item) => item.id === anime.id)
        ? current.filter((item) => item.id !== anime.id)
        : [...current, anime])
    },
  }), [favorites])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider.')
  return context
}
