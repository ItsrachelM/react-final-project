import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="page-heading">
      <p className="eyebrow">404</p>
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link className="primary-button" to="/">Back to explore</Link>
    </section>
  )
}
