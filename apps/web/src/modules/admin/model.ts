import type { DrinkTemperature, FulfillmentType, MenuProduct } from '@brooklyn/contracts'
import { demoMenu } from '../../shared/data/menu'
import { manilaDate } from '../../shared/lib/format'

export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled'
export type CatalogProduct = MenuProduct & { available: boolean }
export interface OrderItem {
  productId: string
  name: string
  temperature: DrinkTemperature | null
  quantity: number
  priceCentavos: number
}
export interface AdminOrder {
  id: string
  customer: string
  fulfillment: FulfillmentType
  status: OrderStatus
  items: OrderItem[]
  time: string
  source: 'Counter' | 'Online'
}
export interface Booking {
  id: string
  name: string
  space: 'VIP room' | 'Activity area'
  date: string
  time: string
  hours: number
  guests: number
  status: 'Pending' | 'Approved' | 'Declined'
}
export interface AdminState {
  businessDate: string
  menu: CatalogProduct[]
  orders: AdminOrder[]
  inventory: { id: string; name: string; quantity: number; unit: string; minimum: number }[]
  movements: { id: string; name: string; quantity: number; unit: string }[]
  bookings: Booking[]
  staff: { id: string; name: string; role: string; initials: string; clockedIn: boolean }[]
  vouchers: { id: string; code: string; minutes: number; status: 'Issued' | 'Revoked' }[]
  posts: { id: string; title: string; body: string; status: 'Draft' | 'Published' }[]
  settings: { name: string; email: string; lowStockAlerts: boolean }
  notice: string
}

export const orderTotal = (order: AdminOrder) =>
  order.items.reduce((sum, item) => sum + item.priceCentavos * item.quantity, 0)
export const nextOrderStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  New: 'Preparing',
  Preparing: 'Ready',
  Ready: 'Completed',
}
export function salesSummary(orders: AdminOrder[]) {
  const completed = orders.filter((order) => order.status === 'Completed')
  const revenue = completed.reduce((sum, order) => sum + orderTotal(order), 0)
  return {
    completed,
    revenue,
    average: completed.length ? Math.round(revenue / completed.length) : 0,
    open: orders.filter((order) => !['Completed', 'Cancelled'].includes(order.status)).length,
  }
}

export function createAdminState(date = manilaDate()): AdminState {
  const item = (index: number, quantity: number): OrderItem => ({
    productId: demoMenu[index].id,
    name: demoMenu[index].name,
    temperature: demoMenu[index].temperatures[0] ?? null,
    quantity,
    priceCentavos: demoMenu[index].priceCentavos,
  })
  return {
    businessDate: date,
    menu: demoMenu.map((product) => ({ ...product, available: true })),
    orders: [
      {
        id: 'BW-1048',
        customer: 'Alex R.',
        fulfillment: 'dine-in',
        status: 'New',
        items: [item(0, 2), item(5, 1)],
        time: '13:42',
        source: 'Counter',
      },
      {
        id: 'BW-1047',
        customer: 'Sam L.',
        fulfillment: 'pickup',
        status: 'Preparing',
        items: [item(3, 1), item(2, 1)],
        time: '13:38',
        source: 'Online',
      },
      {
        id: 'BW-1046',
        customer: 'Jamie T.',
        fulfillment: 'dine-in',
        status: 'Ready',
        items: [item(1, 2)],
        time: '13:31',
        source: 'Counter',
      },
      {
        id: 'BW-1045',
        customer: 'Casey M.',
        fulfillment: 'pickup',
        status: 'Completed',
        items: [item(0, 3), item(5, 2)],
        time: '12:20',
        source: 'Online',
      },
      {
        id: 'BW-1044',
        customer: 'Taylor D.',
        fulfillment: 'dine-in',
        status: 'Completed',
        items: [item(3, 2), item(4, 1)],
        time: '11:45',
        source: 'Counter',
      },
      {
        id: 'BW-1043',
        customer: 'Morgan P.',
        fulfillment: 'dine-in',
        status: 'Completed',
        items: [item(1, 2), item(2, 2), item(5, 2)],
        time: '10:10',
        source: 'Counter',
      },
      {
        id: 'BW-1042',
        customer: 'Riley K.',
        fulfillment: 'pickup',
        status: 'Completed',
        items: [item(0, 2), item(4, 1)],
        time: '09:15',
        source: 'Online',
      },
      {
        id: 'BW-1041',
        customer: 'Jordan S.',
        fulfillment: 'dine-in',
        status: 'Completed',
        items: [item(2, 2), item(5, 1)],
        time: '08:35',
        source: 'Counter',
      },
    ],
    inventory: [
      { id: 'beans', name: 'House espresso beans', quantity: 2.4, unit: 'kg', minimum: 3 },
      { id: 'milk', name: 'Fresh whole milk', quantity: 18, unit: 'L', minimum: 8 },
      { id: 'oat', name: 'Oat milk', quantity: 4, unit: 'L', minimum: 5 },
      { id: 'matcha', name: 'Ceremonial matcha', quantity: 1.2, unit: 'kg', minimum: 0.5 },
      { id: 'cups', name: 'Takeaway cups', quantity: 120, unit: 'pcs', minimum: 50 },
      { id: 'pastry', name: 'Butter croissants', quantity: 8, unit: 'pcs', minimum: 10 },
    ],
    movements: [],
    bookings: [
      {
        id: 'RS-201',
        name: 'Alex Rivera',
        space: 'VIP room',
        date,
        time: '14:00',
        hours: 2,
        guests: 6,
        status: 'Pending',
      },
      {
        id: 'RS-202',
        name: 'Sam Lee',
        space: 'Activity area',
        date,
        time: '15:00',
        hours: 2,
        guests: 8,
        status: 'Approved',
      },
      {
        id: 'RS-203',
        name: 'Jamie Torres',
        space: 'VIP room',
        date,
        time: '17:00',
        hours: 1,
        guests: 4,
        status: 'Pending',
      },
      {
        id: 'RS-204',
        name: 'Casey Mendoza',
        space: 'VIP room',
        date,
        time: '10:00',
        hours: 2,
        guests: 3,
        status: 'Approved',
      },
    ],
    staff: [
      { id: 'ST-01', name: 'Alex Rivera', role: 'Manager', initials: 'AR', clockedIn: true },
      { id: 'ST-02', name: 'Sam Lee', role: 'Barista', initials: 'SL', clockedIn: true },
      { id: 'ST-03', name: 'Jamie Torres', role: 'Cashier', initials: 'JT', clockedIn: true },
      { id: 'ST-04', name: 'Casey Mendoza', role: 'Barista', initials: 'CM', clockedIn: false },
    ],
    vouchers: [
      { id: 'WF-01', code: 'DEMO-PAUSE', minutes: 60, status: 'Issued' },
      { id: 'WF-02', code: 'DEMO-COFFEE', minutes: 120, status: 'Issued' },
      { id: 'WF-03', code: 'DEMO-CORNER', minutes: 60, status: 'Revoked' },
    ],
    posts: [
      {
        id: 'CT-01',
        title: 'A little afternoon pause',
        body: 'Make room for your favorite cup and a freshly baked croissant.',
        status: 'Published',
      },
      {
        id: 'CT-02',
        title: 'Your next gathering starts here',
        body: 'Find a cozy corner for good company in our VIP room.',
        status: 'Draft',
      },
    ],
    settings: {
      name: 'Brooklyn Warehouse Coffee',
      email: 'hello@example.com',
      lowStockAlerts: true,
    },
    notice: '',
  }
}

export type AdminAction =
  | { type: 'clear-notice' }
  | { type: 'order-status'; id: string; status: OrderStatus }
  | {
      type: 'create-order'
      id: string
      customer: string
      fulfillment: FulfillmentType
      items: { productId: string; temperature: DrinkTemperature | null; quantity: number }[]
      time: string
    }
  | { type: 'edit-product'; id: string; priceCentavos: number; available: boolean }
  | { type: 'restock'; id: string; quantity: number; movementId: string }
  | { type: 'booking-status'; id: string; status: 'Approved' | 'Declined' }
  | { type: 'clock'; id: string }
  | { type: 'issue-voucher'; id: string; minutes: number }
  | { type: 'revoke-voucher'; id: string }
  | { type: 'save-post'; id: string; title: string; body: string }
  | { type: 'toggle-post'; id: string }
  | { type: 'settings'; settings: AdminState['settings'] }
  | { type: 'reset' }

export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'clear-notice':
      return { ...state, notice: '' }
    case 'order-status': {
      const order = state.orders.find((row) => row.id === action.id)
      if (
        !order ||
        !(
          nextOrderStatus[order.status] === action.status ||
          (['New', 'Preparing'].includes(order.status) && action.status === 'Cancelled')
        )
      ) {
        return { ...state, notice: 'This order cannot make that status change.' }
      }
      return {
        ...state,
        orders: state.orders.map((row) =>
          row.id === action.id ? { ...row, status: action.status } : row,
        ),
        notice: `${action.id} marked ${action.status.toLowerCase()} in the demo.`,
      }
    }
    case 'create-order': {
      const items: OrderItem[] = []
      if (!action.items.length || state.orders.some((order) => order.id === action.id))
        return { ...state, notice: 'Add an item before creating a demo order.' }
      for (const line of action.items) {
        const product = state.menu.find((row) => row.id === line.productId)
        if (
          !product?.available ||
          !Number.isInteger(line.quantity) ||
          line.quantity < 1 ||
          line.quantity > 20 ||
          (product.temperatures.length
            ? !product.temperatures.includes(line.temperature as DrinkTemperature)
            : line.temperature !== null)
        ) {
          return {
            ...state,
            notice:
              'Review your items. An item is unavailable or has an invalid quantity or temperature.',
          }
        }
        items.push({ ...line, name: product.name, priceCentavos: product.priceCentavos })
      }
      return {
        ...state,
        orders: [
          {
            id: action.id,
            customer: action.customer.trim() || 'Walk-in guest',
            fulfillment: action.fulfillment,
            items,
            time: action.time,
            status: 'New',
            source: 'Counter',
          },
          ...state.orders,
        ],
        notice: `${action.id} created. No payment collected.`,
      }
    }
    case 'edit-product':
      if (
        !Number.isSafeInteger(action.priceCentavos) ||
        action.priceCentavos <= 0 ||
        action.priceCentavos > 10000000
      )
        return { ...state, notice: 'Enter a price between ₱0.01 and ₱100,000.' }
      return {
        ...state,
        menu: state.menu.map((product) =>
          product.id === action.id
            ? { ...product, priceCentavos: action.priceCentavos, available: action.available }
            : product,
        ),
        notice: 'Demo catalog updated. Customer menu is unchanged.',
      }
    case 'restock': {
      const item = state.inventory.find((row) => row.id === action.id)
      if (
        !item ||
        !Number.isFinite(action.quantity) ||
        action.quantity <= 0 ||
        action.quantity > 10000 ||
        (item.unit === 'pcs' && !Number.isInteger(action.quantity))
      )
        return {
          ...state,
          notice: 'Enter a valid positive stock quantity; pieces must be whole numbers.',
        }
      return {
        ...state,
        inventory: state.inventory.map((row) =>
          row.id === item.id
            ? { ...row, quantity: Math.round((row.quantity + action.quantity) * 100) / 100 }
            : row,
        ),
        movements: [
          { id: action.movementId, name: item.name, quantity: action.quantity, unit: item.unit },
          ...state.movements,
        ],
        notice: `${item.name} restocked in the demo.`,
      }
    }
    case 'booking-status': {
      const booking = state.bookings.find((row) => row.id === action.id)
      if (!booking || booking.status !== 'Pending')
        return { ...state, notice: 'This request has already been reviewed.' }
      const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
      if (
        action.status === 'Approved' &&
        state.bookings.some(
          (row) =>
            row.id !== booking.id &&
            row.status === 'Approved' &&
            row.space === booking.space &&
            row.date === booking.date &&
            minutes(row.time) < minutes(booking.time) + booking.hours * 60 &&
            minutes(booking.time) < minutes(row.time) + row.hours * 60,
        )
      )
        return { ...state, notice: 'This space already has an approved booking at that time.' }
      return {
        ...state,
        bookings: state.bookings.map((row) =>
          row.id === action.id ? { ...row, status: action.status } : row,
        ),
        notice: `Request ${action.id} ${action.status.toLowerCase()} in the demo. No email sent.`,
      }
    }
    case 'clock':
      return {
        ...state,
        staff: state.staff.map((row) =>
          row.id === action.id ? { ...row, clockedIn: !row.clockedIn } : row,
        ),
        notice: 'Demo attendance updated.',
      }
    case 'issue-voucher':
      if (![30, 60, 120].includes(action.minutes))
        return { ...state, notice: 'Choose a supported voucher duration.' }
      return {
        ...state,
        vouchers: [
          {
            id: action.id,
            code: `DEMO-${action.id.slice(-8).toUpperCase()}`,
            minutes: action.minutes,
            status: 'Issued',
          },
          ...state.vouchers,
        ],
        notice: 'Sample voucher created. It cannot grant internet access.',
      }
    case 'revoke-voucher':
      return {
        ...state,
        vouchers: state.vouchers.map((row) =>
          row.id === action.id ? { ...row, status: 'Revoked' } : row,
        ),
        notice: 'Demo voucher revoked.',
      }
    case 'save-post':
      if (!action.title.trim() || !action.body.trim())
        return { ...state, notice: 'Add a title and a message.' }
      return {
        ...state,
        posts: [
          { id: action.id, title: action.title.trim(), body: action.body.trim(), status: 'Draft' },
          ...state.posts,
        ],
        notice: 'Draft added to the demo workspace.',
      }
    case 'toggle-post':
      return {
        ...state,
        posts: state.posts.map((row) =>
          row.id === action.id
            ? { ...row, status: row.status === 'Draft' ? 'Published' : 'Draft' }
            : row,
        ),
        notice: 'Demo publication status changed. Customer website is unchanged.',
      }
    case 'settings':
      return {
        ...state,
        settings: action.settings,
        notice: 'Preferences saved for this demo session.',
      }
    case 'reset':
      return {
        ...createAdminState(state.businessDate),
        notice: 'Demo workspace reset to sample data.',
      }
  }
}
