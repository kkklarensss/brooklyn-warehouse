import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="empty-state container page-section">
      <span className="eyebrow">404 / A LITTLE DETOUR</span>
      <h1>
        Let's find your
        <br />
        <em>way back.</em>
      </h1>
      <p>This page isn't on the menu.</p>
      <Link className="button button-primary" to="/">
        Back to Brooklyn
      </Link>
    </section>
  )
}
