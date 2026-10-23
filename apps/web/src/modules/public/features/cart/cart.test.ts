import { describe, expect, it } from 'vitest'
import { demoMenu } from '../../../../shared/data/menu'
import { addLine, cartSubtotal, MAX_QUANTITY, readCart } from './cart'

describe('demo cart integrity', () => {
  const latte = demoMenu[0]
  it('merges the same drink configuration but separates hot and iced', () => {
    let lines = addLine([], latte, 'Iced')
    lines = addLine(lines, latte, 'Iced')
    lines = addLine(lines, latte, 'Hot')
    expect(lines).toEqual([
      { productId: latte.id, temperature: 'Iced', quantity: 2 },
      { productId: latte.id, temperature: 'Hot', quantity: 1 },
    ])
    expect(cartSubtotal(lines, demoMenu)).toBe(43500)
  })
  it('limits quantity when an item is added repeatedly', () => {
    const full = [{ productId: latte.id, temperature: 'Iced' as const, quantity: MAX_QUANTITY }]
    expect(addLine(full, latte, 'Iced')[0].quantity).toBe(MAX_QUANTITY)
  })
  it('rejects invalid drink options', () => {
    expect(addLine([], latte, null)).toEqual([])
    expect(addLine([], demoMenu[5], 'Hot')).toEqual([])
  })
  it('recovers from broken or wrong-shaped saved data', () => {
    expect(readCart('{broken', demoMenu)).toEqual([])
    expect(readCart('{"productId":"spanish-latte"}', demoMenu)).toEqual([])
    expect(readCart(null, demoMenu)).toEqual([])
  })
  it('discards unknown products, invalid quantities, invalid options, and duplicates', () => {
    const valid = { productId: latte.id, temperature: 'Iced', quantity: 2 }
    const saved = JSON.stringify([
      valid,
      valid,
      { ...valid, quantity: -1 },
      { ...valid, quantity: 1.5 },
      { ...valid, temperature: 'Lukewarm' },
      { ...valid, productId: 'removed-product' },
      { ...valid, quantity: 9999 },
    ])
    expect(readCart(saved, demoMenu)).toEqual([valid])
  })
})
