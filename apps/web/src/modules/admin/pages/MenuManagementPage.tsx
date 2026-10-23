import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check, Pencil, X } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, SearchField, Status } from '../components/AdminUI'
import { formatMoney } from '../../../shared/lib/format'

export function MenuManagementPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState('')
  const products = state.menu.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  )
  function save(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    dispatch({
      type: 'edit-product',
      id,
      priceCentavos: Math.round(Number(data.get('price')) * 100),
      available: data.get('available') === 'on',
    })
    setEditing('')
  }
  return (
    <>
      <PageHeading
        title="The familiar favorites."
        description="Care for the little things that make up your menu."
      />
      <Panel
        title="Your demo catalog"
        subtitle="Price and availability changes apply to the admin POS only."
      >
        <div className="admin-toolbar">
          <span className="admin-muted">{state.menu.length} menu items</span>
          <SearchField value={query} onChange={setQuery} placeholder="Search menu or category" />
        </div>
        <div className="admin-catalog">
          {products.map((product) => (
            <article className="admin-catalog-item" key={product.id}>
              <img src={product.image} alt="" />
              <div className="admin-list-copy">
                <span className="admin-category-label">{product.category}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {editing === product.id ? (
                  <form className="admin-inline-form" onSubmit={(event) => save(event, product.id)}>
                    <label className="admin-field">
                      Price (PHP)
                      <input
                        name="price"
                        type="number"
                        min="0.01"
                        max="100000"
                        step="0.01"
                        defaultValue={product.priceCentavos / 100}
                        required
                      />
                    </label>
                    <label className="admin-check">
                      <input type="checkbox" name="available" defaultChecked={product.available} />
                      Available
                    </label>
                    <button className="admin-small-button" type="submit">
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      className="admin-small-button"
                      type="button"
                      onClick={() => setEditing('')}
                    >
                      <X size={14} />
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="admin-catalog-meta">
                    <strong>{formatMoney(product.priceCentavos)}</strong>
                    <Status>{product.available ? 'Available' : 'Unavailable'}</Status>
                    <span>{product.temperatures.join(' / ') || 'Regular'}</span>
                  </div>
                )}
              </div>
              {editing !== product.id && (
                <button className="admin-small-button" onClick={() => setEditing(product.id)}>
                  <Pencil size={14} />
                  Edit<span className="sr-only"> {product.name}</span>
                </button>
              )}
            </article>
          ))}
        </div>
        {!products.length && <EmptyState />}
      </Panel>
    </>
  )
}
