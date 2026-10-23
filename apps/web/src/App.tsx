import { useEffect } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CartProvider } from './features/cart/CartProvider'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { ReservationsPage } from './pages/ReservationsPage'
import { WifiPage } from './pages/WifiPage'
import { HelpPage } from './pages/HelpPage'

function PageEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Your neighborhood pause',
      '/menu': 'Our menu',
      '/reservations': 'Our spaces',
      '/wifi': 'Stay connected',
      '/help': 'A little help',
    }
    document.title = `${titles[pathname] ?? 'Page not found'} · Brooklyn Warehouse Coffee`
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
function NotFoundPage() {
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
export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <PageEffects />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="wifi" element={<WifiPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
