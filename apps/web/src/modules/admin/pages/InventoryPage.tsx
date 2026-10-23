import { useState } from 'react'
import type { FormEvent } from 'react'
import { Package, Plus } from 'lucide-react'
import { useAdmin } from '../AdminProvider'
import { EmptyState, PageHeading, Panel, SearchField, Status } from '../components/AdminUI'

export function InventoryPage() {
  const { state, dispatch } = useAdmin()
  const [query, setQuery] = useState('')
  const [lowOnly, setLowOnly] = useState(false)
  const [restocking, setRestocking] = useState('')
  const items = state.inventory.filter(
    (item) =>
      (!lowOnly || item.quantity < item.minimum) &&
      item.name.toLowerCase().includes(query.toLowerCase()),
  )
  function restock(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()
    dispatch({
      type: 'restock',
      id,
      quantity: Number(new FormData(event.currentTarget).get('quantity')),
      movementId: crypto.randomUUID(),
    })
    setRestocking('')
  }
  return (
    <>
      <PageHeading
        title="A well-stocked little corner."
        description="Keep an eye on the ingredients behind the everyday favorites."
      />
      <Panel
        title="Stock on hand"
        subtitle="Sample stock balances. Orders do not automatically consume ingredients."
      >
        <div className="admin-toolbar">
          <label className="admin-check">
            <input
              type="checkbox"
              checked={lowOnly}
              onChange={(event) => setLowOnly(event.target.checked)}
            />
            Low stock only
          </label>
          <SearchField value={query} onChange={setQuery} placeholder="Find a stock item" />
        </div>
        {items.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <caption className="sr-only">Demo inventory</caption>
              <thead>
                <tr>
                  <th scope="col">Ingredient / supply</th>
                  <th scope="col">On hand</th>
                  <th scope="col">Reorder below</th>
                  <th scope="col">Status</th>
                  <th scope="col">Stock in</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="admin-cell-icon">
                        <Package size={17} />
                        <strong>{item.name}</strong>
                      </span>
                    </td>
                    <td className="admin-money">
                      {item.quantity} {item.unit}
                    </td>
                    <td>
                      {item.minimum} {item.unit}
                    </td>
                    <td>
                      <Status>{item.quantity < item.minimum ? 'Low stock' : 'Available'}</Status>
                    </td>
                    <td>
                      {restocking === item.id ? (
                        <form
                          className="admin-inline-form"
                          onSubmit={(event) => restock(event, item.id)}
                        >
                          <label>
                            <span className="sr-only">Quantity to add in {item.unit}</span>
                            <input
                              className="admin-stock-input"
                              type="number"
                              name="quantity"
                              min={item.unit === 'pcs' ? 1 : 0.01}
                              max="10000"
                              step={item.unit === 'pcs' ? 1 : 0.01}
                              required
                              autoFocus
                            />
                          </label>
                          <button className="admin-small-button" type="submit">
                            Add {item.unit}
                          </button>
                          <button
                            className="admin-small-button"
                            type="button"
                            onClick={() => setRestocking('')}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <button
                          className="admin-small-button"
                          onClick={() => setRestocking(item.id)}
                        >
                          <Plus size={14} />
                          Restock<span className="sr-only"> {item.name}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState />
        )}
      </Panel>
      <Panel title="Stock-in history" subtitle="Movements created during this demo session.">
        {state.movements.length ? (
          <div className="admin-list">
            {state.movements.map((movement) => (
              <div className="admin-list-row" key={movement.id}>
                <span className="admin-stock-icon">
                  <Plus size={18} />
                </span>
                <div className="admin-list-copy">
                  <strong>{movement.name}</strong>
                  <small>Demo stock received</small>
                </div>
                <strong>
                  +{movement.quantity} {movement.unit}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="A fresh page in the stock book."
            description="Restock an item to see its movement here."
          />
        )}
      </Panel>
    </>
  )
}
