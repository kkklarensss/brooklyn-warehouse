import type { CartLine, DrinkTemperature, MenuProduct } from '@brooklyn/contracts'

export const CART_STORAGE_KEY = 'brooklyn-demo-cart-v1'
export const MAX_QUANTITY = 20
export const lineKey = (line: Pick<CartLine, 'productId' | 'temperature'>) =>
  `${line.productId}:${line.temperature ?? 'none'}`

export function addLine(
  lines: CartLine[],
  product: MenuProduct,
  temperature: DrinkTemperature | null,
): CartLine[] {
  if (
    product.temperatures.length
      ? !temperature || !product.temperatures.includes(temperature)
      : temperature !== null
  )
    return lines
  const key = lineKey({ productId: product.id, temperature })
  if (lines.some((line) => lineKey(line) === key))
    return lines.map((line) =>
      lineKey(line) === key
        ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) }
        : line,
    )
  return [...lines, { productId: product.id, temperature, quantity: 1 }]
}

export function readCart(value: string | null, products: readonly MenuProduct[]): CartLine[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    const seen = new Set<string>()
    return parsed.slice(0, 100).flatMap((item: unknown): CartLine[] => {
      if (typeof item !== 'object' || item === null) return []
      const line = item as Record<string, unknown>
      const product = products.find((entry) => entry.id === line.productId)
      if (
        !product ||
        !Number.isInteger(line.quantity) ||
        Number(line.quantity) < 1 ||
        Number(line.quantity) > MAX_QUANTITY
      )
        return []
      const temperature = line.temperature
      if (
        product.temperatures.length
          ? !product.temperatures.some((option) => option === temperature)
          : temperature !== null
      )
        return []
      const clean: CartLine = {
        productId: product.id,
        temperature: temperature as DrinkTemperature | null,
        quantity: Number(line.quantity),
      }
      const key = lineKey(clean)
      if (seen.has(key)) return []
      seen.add(key)
      return [clean]
    })
  } catch {
    return []
  }
}

export function cartSubtotal(lines: CartLine[], products: readonly MenuProduct[]): number {
  return lines.reduce(
    (total, line) =>
      total +
      (products.find((product) => product.id === line.productId)?.priceCentavos ?? 0) *
        line.quantity,
    0,
  )
}
