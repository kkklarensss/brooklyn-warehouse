export type MenuCategory = 'Coffee' | 'Non-coffee' | 'Food & pastries'
export type DrinkTemperature = 'Iced' | 'Hot'

export interface MenuProduct {
  id: string
  name: string
  description: string
  category: MenuCategory
  priceCentavos: number
  image: string
  imagePosition?: string
  temperatures: DrinkTemperature[]
  tag?: string
}

export interface CartLine {
  productId: string
  temperature: DrinkTemperature | null
  quantity: number
}

export type FulfillmentType = 'dine-in' | 'pickup'
