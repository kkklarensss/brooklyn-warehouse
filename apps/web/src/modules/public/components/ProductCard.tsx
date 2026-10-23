import { useState } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import type { DrinkTemperature, MenuProduct } from '@brooklyn/contracts'
import { formatMoney } from '../../../shared/lib/format'
import { useCart } from '../features/cart/CartProvider'

export function ProductCard({ product }: { product: MenuProduct }) {
  const [temperature, setTemperature] = useState<DrinkTemperature | null>(
    product.temperatures[0] ?? null,
  )
  const { add } = useCart()
  return (
    <article className="product-card">
      <div className={`product-art product-art--${product.id}`}>
        {product.tag && (
          <span className="product-tag">
            {product.tag}
            <ArrowUpRight size={12} />
          </span>
        )}
        <img
          src={product.image}
          alt={`Illustration of ${product.name}`}
          loading="lazy"
          width="480"
          height="400"
        />
        <span className="art-index">
          BW /{' '}
          {product.category === 'Coffee'
            ? 'COFFEE'
            : product.category === 'Non-coffee'
              ? 'OTHER SIPS'
              : 'BAKERY'}
        </span>
      </div>
      <div className="product-heading">
        <h3>{product.name}</h3>
        <span>{formatMoney(product.priceCentavos)}</span>
      </div>
      <p>{product.description}</p>
      <div className="product-actions">
        {product.temperatures.length > 0 ? (
          <div
            className="temperature-toggle"
            role="group"
            aria-label={`${product.name} temperature`}
          >
            {product.temperatures.map((option) => (
              <button
                key={option}
                aria-pressed={temperature === option}
                onClick={() => setTemperature(option)}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <span className="bakery-note">A little something on the side</span>
        )}
        <button
          className="add-button"
          aria-label={`Add ${product.name}${temperature ? ` ${temperature}` : ''} to bag`}
          onClick={() => add(product, temperature)}
        >
          <Plus size={16} />
          <span>Add</span>
        </button>
      </div>
    </article>
  )
}
