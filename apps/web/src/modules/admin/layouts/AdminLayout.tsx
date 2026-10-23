import { useState } from 'react'
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronRight,
  Coffee,
  LayoutDashboard,
  Menu,
  Package,
  ReceiptText,
  Settings,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  Wifi,
  X,
  Megaphone,
} from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAdmin } from '../AdminProvider'

const navigation = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard, group: 'WORKSPACE' },
  { label: 'Orders', path: '/admin/orders', icon: ReceiptText },
  { label: 'Point of sale', path: '/admin/pos', icon: ShoppingBag },
  { label: 'Menu', path: '/admin/menu', icon: UtensilsCrossed, group: 'MANAGEMENT' },
  { label: 'Inventory', path: '/admin/inventory', icon: Package },
  { label: 'Reservations', path: '/admin/reservations', icon: CalendarDays },
  { label: 'Staff & attendance', path: '/admin/staff', icon: Users },
  { label: 'Wi-Fi vouchers', path: '/admin/wifi', icon: Wifi },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3, group: 'YOUR BUSINESS' },
  { label: 'Content', path: '/admin/content', icon: Megaphone },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const { state, dispatch } = useAdmin()
  const { pathname } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const current = navigation.find((item) => item.path === pathname.replace(/\/$/, ''))
  const date = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${state.businessDate}T12:00:00+08:00`))
  return (
    <div className="admin-shell">
      <a className="skip-link" href="#admin-main">
        Skip to admin content
      </a>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <Link to="/admin" className="brand" aria-label="Brooklyn admin overview">
            <span className="admin-brand-icon">
              <Coffee size={24} strokeWidth={1.5} />
            </span>
            <span className="brand-type">
              BROOKLYN<span>WAREHOUSE COFFEE</span>
            </span>
          </Link>
          <button
            className="icon-button admin-mobile-toggle"
            aria-label={mobileOpen ? 'Close admin navigation' : 'Open admin navigation'}
            aria-expanded={mobileOpen}
            aria-controls="admin-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
        <div
          className={mobileOpen ? 'admin-sidebar-body is-open' : 'admin-sidebar-body'}
          id="admin-navigation"
        >
          <div className="admin-workspace-label">
            <span className="admin-live-dot" />
            The café workspace<span>DEMO</span>
          </div>
          <nav aria-label="Admin navigation">
            {navigation.map(({ label, path, icon: Icon, group }) => (
              <div key={path}>
                {group && <span className="admin-nav-group">{group}</span>}
                <NavLink to={path} end={path === '/admin'} onClick={() => setMobileOpen(false)}>
                  <Icon size={18} strokeWidth={1.6} />
                  <span>{label}</span>
                  {path === '/admin/orders' && (
                    <span className="admin-nav-count">
                      {
                        state.orders.filter(
                          (order) => !['Completed', 'Cancelled'].includes(order.status),
                        ).length
                      }
                    </span>
                  )}
                </NavLink>
              </div>
            ))}
          </nav>
          <div className="admin-sidebar-bottom">
            <Link to="/">
              <Store size={17} />
              View customer site
              <ArrowUpRight size={15} />
            </Link>
            <div className="admin-profile">
              <span className="admin-avatar">BW</span>
              <div>
                <strong>{state.settings.name}</strong>
                <small>Demo administrator</small>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{current?.label ?? 'Page not found'}</strong>
          </div>
          <div className="admin-topbar-date">
            <CalendarDays size={15} />
            <span>{date}</span>
            <span className="admin-timezone">MANILA</span>
          </div>
        </header>
        <div className="admin-demo-banner">
          <span>
            <span className="admin-live-dot" />
            Demo workspace
          </span>
          <p>
            Sample data only. Changes reset on refresh or exit. No real orders, payments, bookings,
            or Wi-Fi access.
          </p>
        </div>
        <main id="admin-main" className="admin-main" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="admin-footer">
          <span>BROOKLYN WAREHOUSE COFFEE</span>
          <span>
            A little care behind every cup. <span aria-hidden="true">↗</span>
          </span>
        </footer>
      </div>
      <div
        className="admin-notice"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        key={state.notice}
      >
        {state.notice && (
          <span>
            {state.notice}
            <button
              className="icon-button"
              aria-label="Dismiss notification"
              onClick={() => dispatch({ type: 'clear-notice' })}
            >
              <X size={15} />
            </button>
          </span>
        )}
      </div>
    </div>
  )
}
