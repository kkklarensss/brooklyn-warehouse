import { orderTotal } from './model'
import type { AdminOrder } from './model'

function csvCell(value: string) {
  const safe = /^[\s]*[=+@-]/.test(value) ? `'${value}` : value
  return `"${safe.replaceAll('"', '""')}"`
}

export function salesCsv(orders: AdminOrder[]) {
  return [
    ['Demo order', 'Guest', 'Time (Asia/Manila)', 'Fulfillment', 'Total (PHP)', 'Status'],
    ...orders
      .filter((order) => order.status === 'Completed')
      .map((order) => [
        order.id,
        order.customer,
        order.time,
        order.fulfillment,
        (orderTotal(order) / 100).toFixed(2),
        order.status,
      ]),
  ]
    .map((row) => row.map(csvCell).join(','))
    .join('\r\n')
}

export function topProducts(orders: AdminOrder[]) {
  const products = new Map<string, { name: string; quantity: number; revenue: number }>()
  for (const order of orders.filter((row) => row.status === 'Completed')) {
    for (const item of order.items) {
      const current = products.get(item.productId) ?? { name: item.name, quantity: 0, revenue: 0 }
      products.set(item.productId, {
        ...current,
        quantity: current.quantity + item.quantity,
        revenue: current.revenue + item.priceCentavos * item.quantity,
      })
    }
  }
  return [...products.values()].sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
}
