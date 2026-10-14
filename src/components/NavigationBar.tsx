import { NavLink } from 'react-router-dom'

export function NavigationBar() {
  return (
    <header className="site-header">
      <NavLink className="brand" to="/" end>
        Anime Atlas
      </NavLink>
      <nav className="site-nav" aria-label="Main navigation">
        <NavLink to="/" end>
          Explore
        </NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
        <NavLink to="/statistics">Statistics</NavLink>
      </nav>
    </header>
  )
}
