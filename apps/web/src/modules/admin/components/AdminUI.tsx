import type { ReactNode } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatMoney } from '../../../shared/lib/format'
import { orderTotal } from '../model'
import type { AdminOrder } from '../model'

export function PageHeading({
  eyebrow = 'THE DAILY DETAILS',
  title,
  description,
  children,
}: {
  eyebrow?: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="admin-heading-actions">{children}</div>}
    </div>
  )
}

export function Status({ children }: { children: string }) {
  const tone = ['Completed', 'Approved', 'Available', 'On shift', 'Published'].includes(children)
    ? 'green'
    : ['Cancelled', 'Declined', 'Low stock', 'Revoked', 'Unavailable'].includes(children)
      ? 'red'
      : ['New', 'Pending', 'Preparing'].includes(children)
        ? 'amber'
        : 'neutral'
  return (
    <span className={`admin-status admin-status-${tone}`}>
      <i />
      {children}
    </span>
  )
}

export function Panel({
  title,
  subtitle,
  link,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  link?: { to: string; label: string }
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`admin-panel ${className}`}>
      <div className="admin-panel-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {link && (
          <Link className="admin-text-link" to={link.to}>
            {link.label}
            <ArrowUpRight size={15} />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="admin-search">
      <Search size={17} />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  )
}

export function EmptyState({
  title = 'Nothing here just yet.',
  description = 'Try another search or filter.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="admin-empty">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export function OrdersTable({
  orders,
  actions,
}: {
  orders: AdminOrder[]
  actions?: (order: AdminOrder) => ReactNode
}) {
  if (!orders.length) return <EmptyState />
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <caption className="sr-only">Demo orders</caption>
        <thead>
          <tr>
            <th scope="col">Order / guest</th>
            <th scope="col">Items</th>
            <th scope="col">Type</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
            {actions && <th scope="col">Next step</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>
                <strong>{order.id}</strong>
                <small>
                  {order.customer} · {order.time}
                </small>
              </td>
              <td>
                <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                <small>
                  {order.items
                    .map(
                      (item) =>
                        `${item.quantity}× ${item.name}${item.temperature ? ` (${item.temperature})` : ''}`,
                    )
                    .join(', ')}
                </small>
              </td>
              <td>
                {order.fulfillment === 'dine-in' ? 'Dine-in' : 'Pickup'}
                <small>{order.source}</small>
              </td>
              <td className="admin-money">{formatMoney(orderTotal(order))}</td>
              <td>
                <Status>{order.status}</Status>
              </td>
              {actions && <td>{actions(order)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function SalesChart({ orders }: { orders: AdminOrder[] }) {
  const hours = Array.from({ length: 11 }, (_, index) => index + 8)
  const values = hours.map((hour) =>
    orders
      .filter((order) => order.status === 'Completed' && Number(order.time.split(':')[0]) === hour)
      .reduce((sum, order) => sum + orderTotal(order), 0),
  )
  const max = Math.max(...values, 100)
  return (
    <div
      className="admin-chart"
      role="img"
      aria-label={`Completed demo sales by hour. ${hours.map((hour, index) => `${hour}:00: ${formatMoney(values[index])}`).join('; ')}`}
    >
      <div className="admin-chart-scale">
        <span>{formatMoney(max)}</span>
        <span>{formatMoney(Math.round(max / 2))}</span>
        <span>₱0</span>
      </div>
      <div className="admin-chart-plot">
        {hours.map((hour, index) => (
          <div className="admin-chart-column" key={hour}>
            <div className="admin-chart-track">
              <div
                className={values[index] === max ? 'admin-chart-bar is-highest' : 'admin-chart-bar'}
                style={{ height: `${(values[index] / max) * 100}%` }}
                title={`${hour}:00 — ${formatMoney(values[index])}`}
              />
            </div>
            <span>
              {hour > 12 ? hour - 12 : hour}
              {hour >= 12 ? 'p' : 'a'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
