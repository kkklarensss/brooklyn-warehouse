import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { OrdersTable, PageHeading, Panel, SearchField } from '../components/AdminUI'
import { nextOrderStatus } from '../model'

export function OrdersPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const orders = state.orders.filter(
    (order) =>
      (filter === 'All' || order.status === filter) &&
      `${order.id} ${order.customer} ${order.items.map((item) => item.name).join(' ')}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  )
  return (
    <>
      <PageHeading
        title="Every cup, in good hands."
        description="Follow the queue from the first order to the final handoff."
      >
        <Link className="admin-button admin-button-primary" to="/admin/pos">
          <Plus size={16} />
          New order
        </Link>
      </PageHeading>
      <Panel title="Order book" subtitle={`${orders.length} demo orders · all times in Manila`}>
        <div className="admin-toolbar">
          <div className="admin-tabs" role="group" aria-label="Order status">
            {['All', 'New', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status}
              </button>
            ))}
          </div>
          <SearchField value={query} onChange={setQuery} placeholder="Search orders or guests" />
        </div>
        <OrdersTable
          orders={orders}
          actions={(order) => (
            <div className="admin-row-actions">
              {nextOrderStatus[order.status] && (
                <button
                  className="admin-small-button"
                  onClick={() =>
                    dispatch({
                      type: 'order-status',
                      id: order.id,
                      status: nextOrderStatus[order.status]!,
                    })
                  }
                >
                  {order.status === 'New'
                    ? 'Start preparing'
                    : order.status === 'Preparing'
                      ? 'Mark ready'
                      : 'Complete'}
                  <span className="sr-only"> {order.id}</span>
                </button>
              )}
              {['New', 'Preparing'].includes(order.status) && (
                <button
                  className="admin-small-button admin-danger"
                  onClick={() =>
                    dispatch({ type: 'order-status', id: order.id, status: 'Cancelled' })
                  }
                >
                  Cancel<span className="sr-only"> {order.id}</span>
                </button>
              )}
              {['Completed', 'Cancelled'].includes(order.status) && (
                <span className="admin-muted">Closed</span>
              )}
            </div>
          )}
        />
      </Panel>
      <p className="admin-page-note">
        Status changes are local demonstrations. Completing an order does not verify or collect
        payment.
      </p>
    </>
  )
}
