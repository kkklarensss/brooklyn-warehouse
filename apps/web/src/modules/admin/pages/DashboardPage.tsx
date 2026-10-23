import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  Coffee,
  Package,
  ReceiptText,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminProvider'
import { OrdersTable, PageHeading, Panel, SalesChart, Status } from '../components/AdminUI'
import { salesSummary } from '../model'
import { formatMoney } from '../../../shared/lib/format'

export function DashboardPage() {
  const { state } = useAdmin()
  const sales = salesSummary(state.orders)
  const lowStock = state.inventory.filter((item) => item.quantity < item.minimum)
  const pending = state.bookings.filter((booking) => booking.status === 'Pending')
  const onShift = state.staff.filter((person) => person.clockedIn)
  const stats = [
    {
      label: 'Completed sales',
      value: formatMoney(sales.revenue),
      note: `${sales.completed.length} completed demo orders`,
      icon: CircleDollarSign,
    },
    {
      label: 'Orders in progress',
      value: String(sales.open).padStart(2, '0'),
      note: 'From counter & online',
      icon: ReceiptText,
    },
    {
      label: 'Reservation requests',
      value: String(pending.length).padStart(2, '0'),
      note: 'Waiting for your review',
      icon: CalendarDays,
    },
    {
      label: 'Team on shift',
      value: String(onShift.length).padStart(2, '0'),
      note: `${state.staff.length} people on your team`,
      icon: Coffee,
    },
  ]
  return (
    <>
      <PageHeading
        eyebrow="A LITTLE CARE. A WELL-RUN CAFÉ."
        title="Good things brewing."
        description="Here’s a little overview of your café’s day."
      >
        <Link className="admin-button admin-button-primary" to="/admin/pos">
          <span>New counter order</span>
          <ArrowUpRight size={17} />
        </Link>
      </PageHeading>
      <div className="admin-stats">
        {stats.map(({ label, value, note, icon: Icon }) => (
          <article className="admin-stat" key={label}>
            <div>
              <span>{label}</span>
              <Icon size={18} strokeWidth={1.5} />
            </div>
            <strong>{value}</strong>
            <p>{note}</p>
          </article>
        ))}
      </div>
      <div className="admin-dashboard-grid">
        <Panel
          title="The daily pour"
          subtitle="Completed demo sales · PHP · 08:00–18:59 Manila"
          link={{ to: '/admin/reports', label: 'View reports' }}
        >
          <div className="admin-chart-summary">
            <strong>{formatMoney(sales.revenue)}</strong>
            <span>
              <i />
              Completed sales
            </span>
          </div>
          <SalesChart orders={state.orders} />
        </Panel>
        <section className="admin-brief">
          <span className="eyebrow">A MOMENT OF ATTENTION</span>
          <h2>
            The little things
            <br />
            that keep us <em>going.</em>
          </h2>
          <p>Your next steps, all in one place.</p>
          <Link to="/admin/orders">
            <span className="admin-brief-icon">
              <Clock3 size={18} />
            </span>
            <div>
              <strong>{sales.open} orders in the queue</strong>
              <small>Keep the good cups coming</small>
            </div>
            <ArrowUpRight size={17} />
          </Link>
          <Link to="/admin/reservations">
            <span className="admin-brief-icon">
              <CalendarDays size={18} />
            </span>
            <div>
              <strong>{pending.length} requests to review</strong>
              <small>Make a little room for company</small>
            </div>
            <ArrowUpRight size={17} />
          </Link>
          {state.settings.lowStockAlerts && (
            <Link to="/admin/inventory">
              <span className="admin-brief-icon">
                <Package size={18} />
              </span>
              <div>
                <strong>{lowStock.length} items running low</strong>
                <small>A little restock goes a long way</small>
              </div>
              <ArrowUpRight size={17} />
            </Link>
          )}
          <span className="admin-brief-footnote">SAMPLE BUSINESS DAY / DEMO DATA</span>
        </section>
      </div>
      <Panel
        title="A look at the order book"
        subtitle="The latest cups, bites, and little pauses."
        link={{ to: '/admin/orders', label: 'All orders' }}
      >
        <OrdersTable orders={state.orders.slice(0, 4)} />
      </Panel>
      <div className="admin-two-columns">
        <Panel
          title="Make a little room"
          subtitle="Reservation requests for the sample day."
          link={{ to: '/admin/reservations', label: 'Manage' }}
        >
          <div className="admin-list">
            {state.bookings.slice(0, 3).map((booking) => (
              <div className="admin-list-row" key={booking.id}>
                <span className="admin-date-tile">
                  {booking.time}
                  <small>MANILA</small>
                </span>
                <div className="admin-list-copy">
                  <strong>{booking.name}</strong>
                  <small>
                    {booking.space} · {booking.guests} guests
                  </small>
                </div>
                <Status>{booking.status}</Status>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title="Keep the shelves happy"
          subtitle="Stock below its reorder level."
          link={{ to: '/admin/inventory', label: 'Inventory' }}
        >
          <div className="admin-list">
            {lowStock.length ? (
              lowStock.map((item) => (
                <div className="admin-list-row" key={item.id}>
                  <span className="admin-stock-icon">
                    <Package size={19} strokeWidth={1.5} />
                  </span>
                  <div className="admin-list-copy">
                    <strong>{item.name}</strong>
                    <small>
                      Reorder below {item.minimum} {item.unit}
                    </small>
                  </div>
                  <span className="admin-stock-amount">
                    {item.quantity} <small>{item.unit} left</small>
                  </span>
                </div>
              ))
            ) : (
              <p className="admin-inline-note">All stocked up. A good little feeling.</p>
            )}
          </div>
        </Panel>
      </div>
      <Link className="admin-bottom-link" to="/">
        <span>See things from the other side. Visit the customer website.</span>
        <ArrowRight size={17} />
      </Link>
    </>
  )
}
