import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { FulfillmentType } from '@brooklyn/contracts'
import { useCart } from './CartProvider'
import { lineKey, MAX_QUANTITY } from './cart'
import { menuService } from '../../services/menuService'
import { formatMoney } from '../../../../shared/lib/format'

export function CartDrawer() {
  const { isOpen, setOpen, lines, subtotal, count, changeQuantity, remove } = useCart()
  const dialog = useRef<HTMLDialogElement>(null)
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('dine-in')
  const [preview, setPreview] = useState(false)
  useEffect(() => {
    if (isOpen) dialog.current?.showModal()
    else dialog.current?.close()
  }, [isOpen])
  function close() {
    setOpen(false)
    setPreview(false)
  }
  return (
    <dialog
      ref={dialog}
      className="cart-dialog"
      aria-labelledby="cart-title"
      onCancel={close}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="cart-panel">
        <div className="cart-header">
          <div>
            <span className="eyebrow">YOUR NEXT GOOD MOMENT</span>
            <h2 id="cart-title">
              Your bag <span>({count})</span>
            </h2>
          </div>
          <button className="icon-button" aria-label="Close bag" onClick={close}>
            <X />
          </button>
        </div>
        {lines.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={40} strokeWidth={1} />
            <h3>Something good belongs here.</h3>
            <p>Find your favorite sip and make a little time for yourself.</p>
            <Link className="button button-primary" to="/menu" onClick={close}>
              Explore the menu
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : preview ? (
          <div className="order-preview">
            <div className="success-mark">
              <Check />
            </div>
            <span className="eyebrow">DEMO ORDER SUMMARY</span>
            <h3>A preview of your next cup.</h3>
            <p>
              This order has <strong>not been submitted</strong>. No payment was taken. Your bag is
              saved on this device.
            </p>
            <dl className="summary-list">
              <div>
                <dt>Order type</dt>
                <dd>{fulfillment === 'dine-in' ? 'Dine-in' : 'Pickup'}</dd>
              </div>
              <div>
                <dt>Items</dt>
                <dd>{count}</dd>
              </div>
              <div>
                <dt>Sample total</dt>
                <dd>{formatMoney(subtotal)}</dd>
              </div>
            </dl>
            <button className="button button-outline w-full" onClick={() => setPreview(false)}>
              Back to your bag
            </button>
          </div>
        ) : (
          <>
            <div className="cart-lines">
              {lines.map((line) => {
                const product = menuService.getById(line.productId)
                if (!product) return null
                const key = lineKey(line)
                return (
                  <article className="cart-line" key={key}>
                    <img src={product.image} alt="" width="88" height="88" />
                    <div className="cart-line-info">
                      <h3>{product.name}</h3>
                      <span>{line.temperature ?? 'Food & pastries'}</span>
                      <div className="quantity-control">
                        <button
                          aria-label={`Decrease ${product.name} ${line.temperature ?? ''} quantity`}
                          disabled={line.quantity <= 1}
                          onClick={() => changeQuantity(key, -1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          aria-label={`Increase ${product.name} ${line.temperature ?? ''} quantity`}
                          disabled={line.quantity >= MAX_QUANTITY}
                          onClick={() => changeQuantity(key, 1)}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="cart-line-end">
                      <strong>{formatMoney(product.priceCentavos * line.quantity)}</strong>
                      <button
                        className="icon-button"
                        aria-label={`Remove ${product.name} ${line.temperature ?? ''}`}
                        onClick={() => remove(key)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            <div className="cart-bottom">
              <fieldset className="order-type">
                <legend>How are you enjoying your order?</legend>
                {(['dine-in', 'pickup'] as const).map((type) => (
                  <label key={type}>
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillment === type}
                      onChange={() => setFulfillment(type)}
                    />
                    {type === 'dine-in' ? 'Dine-in' : 'Pickup'}
                  </label>
                ))}
              </fieldset>
              <div className="subtotal">
                <span>Sample subtotal</span>
                <strong>{formatMoney(subtotal)}</strong>
              </div>
              <p className="fine-print">
                Demo menu and prices. Checkout and payments will be available after backend
                integration.
              </p>
              <button className="button button-primary w-full" onClick={() => setPreview(true)}>
                Preview order
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
