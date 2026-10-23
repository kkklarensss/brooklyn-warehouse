import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { PublicApp } from './modules/public/PublicApp'
import { CartProvider } from './modules/public/features/cart/CartProvider'

const AdminApp = lazy(() => import('./modules/admin/AdminApp'))

function PageEffects() {
  const { pathname } = useLocation()
  useEffect(() => {
    const titles: Record<string, string> = {
      '/': 'Your neighborhood pause',
      '/menu': 'Our menu',
      '/reservations': 'Our spaces',
      '/wifi': 'Stay connected',
      '/help': 'A little help',
      '/admin': 'Admin · Overview',
      '/admin/orders': 'Admin · Orders',
      '/admin/pos': 'Admin · Point of sale',
      '/admin/menu': 'Admin · Menu',
      '/admin/inventory': 'Admin · Inventory',
      '/admin/reservations': 'Admin · Reservations',
      '/admin/staff': 'Admin · Staff & attendance',
      '/admin/wifi': 'Admin · Wi-Fi vouchers',
      '/admin/reports': 'Admin · Reports',
      '/admin/content': 'Admin · Content',
      '/admin/settings': 'Admin · Settings',
    }
    document.title = `${titles[pathname.replace(/\/$/, '') || '/'] ?? 'Page not found'} · Brooklyn Warehouse Coffee`
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}
export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <PageEffects />
        <Routes>
          <Route
            path="admin/*"
            element={
              <Suspense
                fallback={
                  <div className="container page-section section" role="status">
                    Opening the café workspace…
                  </div>
                }
              >
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="/*" element={<PublicApp />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}
