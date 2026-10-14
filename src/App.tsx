import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavigationBar } from './components/NavigationBar'
import { AnimeDetailPage } from './pages/AnimeDetailPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StatisticsPage } from './pages/StatisticsPage'
import { FavoritesProvider } from './context/FavoritesContext'
import './App.css'

function AppLayout() {
  return (
    <>
      <NavigationBar />
      <main className="page-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/items/:id" element={<AnimeDetailPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <AppLayout />
      </FavoritesProvider>
    </BrowserRouter>
  )
}

export default App
