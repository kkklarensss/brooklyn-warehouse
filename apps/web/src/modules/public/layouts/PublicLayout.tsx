import { useState } from 'react'
import { ArrowUpRight, Coffee, MapPin, Menu, ShoppingBag, X } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useCart } from '../features/cart/CartProvider'
import { CartDrawer } from '../features/cart/CartDrawer'

const copyrightYear = new Date().getFullYear()

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, setOpen, announcement } = useCart()
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="preview-banner">
        <span>GOOD COFFEE. GOOD COMPANY.</span>
        <span>
          Frontend preview <i /> Demo data only
        </span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link
            to="/"
            className="brand"
            aria-label="Brooklyn Warehouse Coffee home"
            onClick={() => setMobileOpen(false)}
          >
            <span className="brand-symbol">
              <Coffee size={27} strokeWidth={1.5} />
            </span>
            <span className="brand-type">
              BROOKLYN<span>WAREHOUSE COFFEE</span>
            </span>
          </Link>
          <nav
            aria-label="Main navigation"
            className={mobileOpen ? 'main-nav is-open' : 'main-nav'}
            id="main-nav"
          >
            {[
              ['/', 'Home'],
              ['/menu', 'Our menu'],
              ['/reservations', 'Our spaces'],
              ['/wifi', 'Stay connected'],
            ].map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setMobileOpen(false)}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="bag-button"
              aria-label={`Open bag, ${count} items`}
              onClick={() => setOpen(true)}
            >
              <ShoppingBag size={18} />
              <span>Your bag</span>
              <span className="bag-count">{count}</span>
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
              aria-expanded={mobileOpen}
              aria-controls="main-nav"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-main container">
          <div>
            <Link to="/" className="brand footer-brand">
              <span className="brand-type">
                BROOKLYN<span>WAREHOUSE COFFEE</span>
              </span>
            </Link>
            <p>
              A place for your everyday pauses.
              <br />A cup for whatever comes next.
            </p>
          </div>
          <div>
            <span className="eyebrow">FIND YOUR WAY HERE</span>
            <p>
              <MapPin size={15} />
              2F YOU.suites, 2113 Recto Avenue
              <br />
              Sampaloc, Manila
            </p>
          </div>
          <div className="footer-links">
            <Link to="/menu">
              Explore the menu
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/reservations">
              Make room for a moment
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/help">
              Questions? Start here
              <ArrowUpRight size={15} />
            </Link>
            <Link to="/admin">
              Admin demo workspace
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom container">
          <span>© {copyrightYear} Brooklyn Warehouse Coffee · Capstone rebuild</span>
          <span>Menu, prices, and spaces are demonstration content.</span>
        </div>
      </footer>
      <div className="cart-toast" role="status" key={announcement}>
        {announcement && (
          <>
            <ShoppingBag size={15} />
            <span>{announcement}</span>
            <button onClick={() => setOpen(true)}>View bag</button>
          </>
        )}
      </div>
      <CartDrawer />
    </>
  )
}
