import { useState } from 'react'
import { Coffee, Search, X } from 'lucide-react'
import type { MenuCategory } from '@brooklyn/contracts'
import { ProductCard } from '../components/ProductCard'
import { menuService } from '../services/menuService'

const categories: ('Everything' | MenuCategory)[] = [
  'Everything',
  'Coffee',
  'Non-coffee',
  'Food & pastries',
]
export function MenuPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('Everything')
  const [query, setQuery] = useState('')
  const products = menuService
    .getAll()
    .filter(
      (product) =>
        (category === 'Everything' || product.category === category) &&
        `${product.name} ${product.description}`.toLowerCase().includes(query.trim().toLowerCase()),
    )
  return (
    <section className="section container page-section">
      <div className="page-intro">
        <span className="eyebrow">SOMETHING FOR YOUR EVERYDAY</span>
        <h1>
          Find your <em>usual.</em>
        </h1>
        <p>A morning pick-me-up, an afternoon pause, or a little treat just because.</p>
      </div>
      <div className="menu-toolbar">
        <div className="category-tabs" role="group" aria-label="Filter menu category">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'selected' : ''}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="search-box">
          <Search size={17} />
          <label className="sr-only" htmlFor="menu-search">
            Search the menu
          </label>
          <input
            id="menu-search"
            type="search"
            placeholder="Find your favorite…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear menu search"
              onClick={() => setQuery('')}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="menu-results">
        <span>
          {products.length} {products.length === 1 ? 'favorite' : 'favorites'} to discover
        </span>
        <span>Sample menu · All prices in PHP</span>
      </div>
      {products.length > 0 ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Coffee size={36} strokeWidth={1} />
          <h2>No sips found just yet.</h2>
          <p>Try another name or explore a different category.</p>
          <button
            className="button button-outline"
            onClick={() => {
              setQuery('')
              setCategory('Everything')
            }}
          >
            Show everything
          </button>
        </div>
      )}
      <p className="catalog-note">
        Illustrated menu items and prices are demonstration content, pending café approval.
      </p>
    </section>
  )
}
