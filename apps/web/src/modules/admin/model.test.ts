import { describe, expect, it } from 'vitest'
import { adminReducer, createAdminState, orderTotal, salesSummary } from './model'
import { salesCsv, topProducts } from './reporting'

describe('admin demo workflows', () => {
  const initial = () => createAdminState('2026-10-23')

  it('creates a counter order and carries it through the queue into sales', () => {
    const start = initial()
    const before = salesSummary(start.orders)
    let state = adminReducer(start, {
      type: 'create-order',
      id: 'POS-TEST',
      customer: '  Guest  ',
      fulfillment: 'pickup',
      time: '14:00',
      items: [
        { productId: 'spanish-latte', temperature: 'Hot', quantity: 2 },
        { productId: 'croissant', temperature: null, quantity: 1 },
      ],
    })
    expect(state.orders[0].customer).toBe('Guest')
    expect(orderTotal(state.orders[0])).toBe(38500)
    expect(salesSummary(state.orders).revenue).toBe(before.revenue)
    expect(salesSummary(state.orders).open).toBe(before.open + 1)
    for (const status of ['Preparing', 'Ready', 'Completed'] as const) {
      state = adminReducer(state, { type: 'order-status', id: 'POS-TEST', status })
    }
    expect(salesSummary(state.orders).revenue).toBe(before.revenue + 38500)
    expect(salesSummary(state.orders).open).toBe(before.open)
    expect(state.inventory).toEqual(start.inventory)
  })

  it('keeps historical totals when the catalog price changes', () => {
    const start = initial()
    const state = adminReducer(start, {
      type: 'edit-product',
      id: 'spanish-latte',
      priceCentavos: 19000,
      available: true,
    })
    expect(state.menu[0].priceCentavos).toBe(19000)
    expect(orderTotal(state.orders[0])).toBe(orderTotal(start.orders[0]))
    const after = adminReducer(state, {
      type: 'create-order',
      id: 'POS-PRICE',
      customer: '',
      fulfillment: 'dine-in',
      time: '14:10',
      items: [{ productId: 'spanish-latte', temperature: 'Hot', quantity: 1 }],
    })
    expect(orderTotal(after.orders[0])).toBe(19000)
  })

  it.each([0, -1, 1.5, 21, NaN])('rejects invalid order quantity %s', (quantity) => {
    const state = initial()
    const after = adminReducer(state, {
      type: 'create-order',
      id: 'POS-BAD',
      customer: '',
      fulfillment: 'dine-in',
      time: '14:00',
      items: [{ productId: 'spanish-latte', temperature: 'Iced', quantity }],
    })
    expect(after.orders).toEqual(state.orders)
  })

  it('rejects unavailable products, invalid variants, and empty orders', () => {
    const state = adminReducer(initial(), {
      type: 'edit-product',
      id: 'spanish-latte',
      priceCentavos: 14500,
      available: false,
    })
    for (const items of [
      [],
      [{ productId: 'spanish-latte', temperature: 'Hot' as const, quantity: 1 }],
      [{ productId: 'croissant', temperature: 'Hot' as const, quantity: 1 }],
    ]) {
      expect(
        adminReducer(state, {
          type: 'create-order',
          id: 'POS-BAD',
          customer: '',
          fulfillment: 'dine-in',
          time: '14:00',
          items,
        }).orders,
      ).toEqual(state.orders)
    }
  })

  it('prevents skipped or reopened order states and excludes cancellations from sales', () => {
    const state = initial()
    expect(
      adminReducer(state, { type: 'order-status', id: 'BW-1048', status: 'Completed' }).orders,
    ).toEqual(state.orders)
    expect(
      adminReducer(state, { type: 'order-status', id: 'BW-1045', status: 'New' }).orders,
    ).toEqual(state.orders)
    const cancelled = adminReducer(state, {
      type: 'order-status',
      id: 'BW-1048',
      status: 'Cancelled',
    })
    expect(salesSummary(cancelled.orders).revenue).toBe(salesSummary(state.orders).revenue)
    expect(salesSummary(cancelled.orders).open).toBe(salesSummary(state.orders).open - 1)
    expect(topProducts(cancelled.orders).reduce((sum, item) => sum + item.revenue, 0)).toBe(
      salesSummary(cancelled.orders).revenue,
    )
  })

  it('records restocks without fractional pieces or invalid quantities', () => {
    const state = initial()
    const restocked = adminReducer(state, {
      type: 'restock',
      id: 'beans',
      quantity: 1.6,
      movementId: 'MOV-1',
    })
    expect(restocked.inventory.find((item) => item.id === 'beans')?.quantity).toBe(4)
    expect(restocked.movements[0]).toMatchObject({
      name: 'House espresso beans',
      quantity: 1.6,
      unit: 'kg',
    })
    for (const quantity of [-1, 0, NaN, Infinity, 0.5]) {
      expect(
        adminReducer(state, { type: 'restock', id: 'cups', quantity, movementId: 'BAD' }).inventory,
      ).toEqual(state.inventory)
    }
  })

  it('blocks overlapping approvals while allowing bookings at the end boundary', () => {
    const state = initial()
    state.bookings.push({ ...state.bookings[0], id: 'CONFLICT', time: '11:00' })
    const conflict = adminReducer(state, {
      type: 'booking-status',
      id: 'CONFLICT',
      status: 'Approved',
    })
    expect(conflict.bookings.find((booking) => booking.id === 'CONFLICT')?.status).toBe('Pending')
    state.bookings.push({ ...state.bookings[0], id: 'BOUNDARY', time: '12:00' })
    const approved = adminReducer(state, {
      type: 'booking-status',
      id: 'BOUNDARY',
      status: 'Approved',
    })
    expect(approved.bookings.find((booking) => booking.id === 'BOUNDARY')?.status).toBe('Approved')
    expect(
      adminReducer(approved, { type: 'booking-status', id: 'BOUNDARY', status: 'Declined' })
        .bookings,
    ).toEqual(approved.bookings)
  })

  it('exports only completed orders and escapes guest input for spreadsheets', () => {
    const state = initial()
    state.orders[3].customer = '=SUM(1,2)'
    const csv = salesCsv(state.orders)
    expect(csv).not.toContain('BW-1048')
    expect(csv).toContain('BW-1045')
    expect(csv).toContain('"\'=SUM(1,2)"')
    expect(csv.split('\r\n')).toHaveLength(salesSummary(state.orders).completed.length + 1)
  })

  it('resets changes across modules while retaining the sample business date', () => {
    let state = initial()
    state = adminReducer(state, { type: 'clock', id: 'ST-01' })
    state = adminReducer(state, { type: 'issue-voucher', id: 'WF-TEST', minutes: 30 })
    state = adminReducer(state, {
      type: 'save-post',
      id: 'CT-TEST',
      title: 'New story',
      body: 'Hello café.',
    })
    const reset = adminReducer(state, { type: 'reset' })
    expect(reset).toEqual({ ...initial(), notice: 'Demo workspace reset to sample data.' })
  })
})
