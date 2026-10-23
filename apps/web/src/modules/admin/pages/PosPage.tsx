import { useState } from 'react'
import type { DrinkTemperature, FulfillmentType } from '@brooklyn/contracts'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, SearchField, Status } from '../components/AdminUI'
import { formatMoney } from '../../../shared/lib/format'

interface Line {
  productId: string
  temperature: DrinkTemperature | null
  quantity: number
}
export function PosPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [lines, setLines] = useState<Line[]>([])
  const [customer, setCustomer] = useState('')
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('dine-in')
  const [created, setCreated] = useState('')
  const total = lines.reduce(
    (sum, line) =>
      sum +
      state.menu.find((product) => product.id === line.productId)!.priceCentavos * line.quantity,
    0,
  )
  const products = state.menu.filter(
    (product) =>
      (category === 'All' || product.category === category) &&
      product.name.toLowerCase().includes(query.toLowerCase()),
  )
  const invalid = lines.some(
    (line) => !state.menu.find((product) => product.id === line.productId)?.available,
  )
  function add(productId: string, temperature: DrinkTemperature | null) {
    setCreated('')
    setLines((current) => {
      const existing = current.find(
        (line) => line.productId === productId && line.temperature === temperature,
      )
      return existing
        ? current.map((line) =>
            line === existing ? { ...line, quantity: Math.min(20, line.quantity + 1) } : line,
          )
        : [...current, { productId, temperature, quantity: 1 }]
    })
  }
  function submit() {
    if (!lines.length || invalid) return
    const id = `POS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
    dispatch({
      type: 'create-order',
      id,
      customer,
      fulfillment,
      items: lines,
      time: new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(new Date()),
    })
    setLines([])
    setCustomer('')
    setCreated(id)
  }
  return (
    <>
      <PageHeading
        title="Something good, coming up."
        description="A simple counter workspace for a cup, a bite, and a little company."
      />
      <div className="admin-pos-layout">
        <section>
          <div className="admin-toolbar admin-pos-toolbar">
            <SearchField value={query} onChange={setQuery} placeholder="Find a menu item" />
            <label className="admin-filter">
              <span className="sr-only">Product category</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                {['All', 'Coffee', 'Non-coffee', 'Food & pastries'].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="admin-pos-products">
            {products.map((product) => (
              <article className="admin-pos-product" key={product.id}>
                <div className={`admin-product-image product-art--${product.id}`}>
                  <img src={product.image} alt="" />
                </div>
                <div className="admin-pos-product-copy">
                  <span className="admin-category-label">{product.category}</span>
                  <h2>{product.name}</h2>
                  <strong>{formatMoney(product.priceCentavos)}</strong>
                  {product.available ? (
                    <div className="admin-product-add">
                      {(product.temperatures.length ? product.temperatures : [null]).map(
                        (temperature) => (
                          <button
                            className="admin-small-button"
                            key={temperature ?? 'regular'}
                            onClick={() => add(product.id, temperature)}
                            aria-label={`Add ${temperature ?? ''} ${product.name}`}
                          >
                            <Plus size={13} />
                            {temperature ?? 'Add item'}
                          </button>
                        ),
                      )}
                    </div>
                  ) : (
                    <Status>Unavailable</Status>
                  )}
                </div>
              </article>
            ))}
          </div>
          {!products.length && <EmptyState />}
        </section>
        <section className="admin-panel admin-pos-ticket">
          <div className="admin-panel-heading">
            <h2>The counter bag</h2>
            <ShoppingBag size={19} />
          </div>
          {created && (
            <div className="admin-success" role="status">
              {created} added to the queue. <Link to="/admin/orders">View orders →</Link>
            </div>
          )}
          <div className="admin-ticket-content">
            {lines.length ? (
              lines.map((line, index) => {
                const product = state.menu.find((item) => item.id === line.productId)!
                return (
                  <div className="admin-ticket-line" key={`${line.productId}-${line.temperature}`}>
                    <div>
                      <strong>{product.name}</strong>
                      <small>
                        {line.temperature ?? 'Regular'} · {formatMoney(product.priceCentavos)}
                      </small>
                      <div className="admin-quantity">
                        <button
                          aria-label={`Decrease ${product.name} ${line.temperature ?? ''}`}
                          disabled={line.quantity === 1}
                          onClick={() =>
                            setLines((current) =>
                              current.map((item, i) =>
                                i === index ? { ...item, quantity: item.quantity - 1 } : item,
                              ),
                            )
                          }
                        >
                          <Minus size={12} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          aria-label={`Increase ${product.name} ${line.temperature ?? ''}`}
                          disabled={line.quantity === 20}
                          onClick={() =>
                            setLines((current) =>
                              current.map((item, i) =>
                                i === index ? { ...item, quantity: item.quantity + 1 } : item,
                              ),
                            )
                          }
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <strong>{formatMoney(product.priceCentavos * line.quantity)}</strong>
                      <button
                        className="icon-button"
                        aria-label={`Remove ${product.name} ${line.temperature ?? ''}`}
                        onClick={() => setLines((current) => current.filter((_, i) => i !== index))}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <EmptyState
                title="A fresh little start."
                description="Choose a menu item to begin an order."
              />
            )}
          </div>
          <div className="admin-ticket-bottom">
            <label className="admin-field">
              Guest name (optional)
              <input
                value={customer}
                maxLength={80}
                onChange={(event) => setCustomer(event.target.value)}
                placeholder="Walk-in guest"
              />
            </label>
            <fieldset className="admin-fulfillment">
              <legend>Order type</legend>
              {(['dine-in', 'pickup'] as const).map((type) => (
                <label key={type}>
                  <input
                    type="radio"
                    name="admin-fulfillment"
                    checked={fulfillment === type}
                    onChange={() => setFulfillment(type)}
                  />
                  {type === 'dine-in' ? 'Dine-in' : 'Pickup'}
                </label>
              ))}
            </fieldset>
            <div className="admin-ticket-total">
              <span>Sample total</span>
              <strong>{formatMoney(total)}</strong>
            </div>
            {invalid && (
              <p className="admin-error" role="alert">
                Remove unavailable items before continuing.
              </p>
            )}
            <button
              className="admin-button admin-button-primary"
              disabled={!lines.length || invalid}
              onClick={submit}
            >
              Create demo order
              <Plus size={16} />
            </button>
            <p className="admin-page-note">
              No payment is collected. Stock is not deducted in this demo.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
