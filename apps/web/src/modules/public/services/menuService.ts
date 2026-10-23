import type { MenuProduct } from '@brooklyn/contracts'
import { demoMenu } from '../../../shared/data/menu'

// Single replacement point for the future GET /api/v1/catalog call.
export const menuService = {
  getAll(): readonly MenuProduct[] {
    return demoMenu
  },
  getById(id: string): MenuProduct | undefined {
    return demoMenu.find((product) => product.id === id)
  },
}
