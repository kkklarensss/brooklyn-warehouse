import { Download } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, SalesChart } from '../components/AdminUI'
import { orderTotal, salesSummary } from '../model'
import { salesCsv, topProducts } from '../reporting'
import { formatMoney, manilaDate } from '../../../shared/lib/format'

export function ReportsPage() {
  const { state } = useAdmin()
  const sales = salesSummary(state.orders)
  const products = topProducts(state.orders)
  function download() {
    const url = URL.createObjectURL(
      new Blob(['\uFEFF', salesCsv(state.orders)], { type: 'text/csv;charset=utf-8;' }),
    )
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `brooklyn-demo-sales-${manilaDate()}.csv`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <>
      <PageHeading
        title="A little perspective."
        description="Turn the day’s cups and conversations into a clearer picture."
      >
        <button className="admin-button admin-button-primary" onClick={download}>
          <Download size={16} />
          Export demo sales
        </button>
      </PageHeading>
      <div className="admin-stats admin-stats-three">
        {[
          {
            label: 'Completed sales',
            value: formatMoney(sales.revenue),
            note: 'Sum of completed demo orders',
          },
          {
            label: 'Completed orders',
            value: sales.completed.length,
            note: 'Open and cancelled orders excluded',
          },
          {
            label: 'Average order',
            value: formatMoney(sales.average),
            note: 'Completed sales ÷ completed orders',
          },
        ].map((stat) => (
          <article className="admin-stat" key={stat.label}>
            <div>
              <span>{stat.label}</span>
            </div>
            <strong>{stat.value}</strong>
            <p>{stat.note}</p>
          </article>
        ))}
      </div>
      <div className="admin-two-columns">
        <Panel
          title="The daily pour"
          subtitle="Sample business day · completed sales, 08:00–18:59 Manila"
        >
          <SalesChart orders={state.orders} />
        </Panel>
        <Panel
          title="How guests enjoy their order"
          subtitle="Completed demo orders by fulfillment."
        >
          <div className="admin-fulfillment-report">
            {(['dine-in', 'pickup'] as const).map((type) => {
              const orders = sales.completed.filter((order) => order.fulfillment === type)
              const revenue = orders.reduce((sum, order) => sum + orderTotal(order), 0)
              return (
                <div key={type}>
                  <div>
                    <strong>{type === 'dine-in' ? 'Dine-in' : 'Pickup'}</strong>
                    <span>{formatMoney(revenue)}</span>
                  </div>
                  <div className="admin-progress">
                    <span
                      style={{ width: `${sales.revenue ? (revenue / sales.revenue) * 100 : 0}%` }}
                    />
                  </div>
                  <small>{orders.length} completed orders</small>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
      <Panel
        title="The crowd favorites"
        subtitle="Ranked by quantity across completed demo orders."
      >
        {products.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Products sold in completed demo orders</caption>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Menu item</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Sales</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.name}>
                    <td className="admin-muted">{String(index + 1).padStart(2, '0')}</td>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.quantity}</td>
                    <td className="admin-money">{formatMoney(product.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="The first cup is still ahead."
            description="Complete a demo order to see sales here."
          />
        )}
      </Panel>
      <p className="admin-page-note">
        Demonstration totals only. Order completion is not payment verification. Taxes, refunds,
        stock consumption, and payment reconciliation are not connected.
      </p>
    </>
  )
}
