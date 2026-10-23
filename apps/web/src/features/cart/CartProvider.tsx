import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartLine, DrinkTemperature, MenuProduct } from '@brooklyn/contracts'
import { menuService } from '../../services/menuService'
import { addLine, CART_STORAGE_KEY, cartSubtotal, lineKey, MAX_QUANTITY, readCart } from './cart'

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (product: MenuProduct, temperature: DrinkTemperature | null) => void
  changeQuantity: (key: string, delta: number) => void
  remove: (key: string) => void
  announcement: string
}
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      return readCart(localStorage.getItem(CART_STORAGE_KEY), menuService.getAll())
    } catch {
      return []
    }
  })
  const [isOpen, setOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* In-memory cart still works without storage. */
    }
  }, [lines])
  function add(product: MenuProduct, temperature: DrinkTemperature | null) {
    setLines((current) => addLine(current, product, temperature))
    setAnnouncement(
      `${product.name}${temperature ? ` (${temperature})` : ''} added to your bag. Maximum ${MAX_QUANTITY} per item.`,
    )
  }
  return (
    <CartContext.Provider
      value={{
        lines,
        count: lines.reduce((total, line) => total + line.quantity, 0),
        subtotal: cartSubtotal(lines, menuService.getAll()),
        isOpen,
        setOpen,
        add,
        announcement,
        changeQuantity: (key, delta) =>
          setLines((current) =>
            current.map((line) =>
              lineKey(line) === key
                ? { ...line, quantity: Math.max(1, Math.min(MAX_QUANTITY, line.quantity + delta)) }
                : line,
            ),
          ),
        remove: (key) => setLines((current) => current.filter((line) => lineKey(line) !== key)),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// oxlint-disable-next-line react/only-export-components
export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be called inside CartProvider')
  return context
}
