import { Link } from 'react-router-dom'
import { PageHeading } from '../components/AdminUI'

export function NotFoundPage() {
  return (
    <>
      <PageHeading
        eyebrow="404 / A LITTLE DETOUR"
        title="Let’s find your way back."
        description="This workspace page could not be found."
      />
      <Link className="admin-button admin-button-primary" to="/admin">
        Back to overview
      </Link>
    </>
  )
}
