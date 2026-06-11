'use client'

import { useCart } from '@/context/CartContext'
import { useEffect, useRef, useState } from 'react'

const WA_NUMBER = '919296909095'

function buildWhatsAppMessage(items: ReturnType<typeof useCart>['items'], total: number) {
  const lines = items.map(i => `• ${i.quantity} × ${i.name} (₹${i.price} each) = ₹${(i.price * i.quantity).toLocaleString('en-IN')}`).join('\n')
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  return encodeURIComponent(
    `Hello Exotica! 🌍\n\nI would like to order:\n\n${lines}\n\nTotal Items: ${totalItems}\nEstimated Total: ₹${total.toLocaleString('en-IN')}\n\nPlease confirm availability and delivery.\nThank You! 🙏`
  )
}

// ── Add-to-cart Toast ─────────────────────────────────────────
function CartToast({ name, visible }: { name: string; visible: boolean }) {
  return (
    <div className={`cart-toast${visible ? ' visible' : ''}`} aria-live="polite" role="status">
      <i className="fas fa-check-circle" aria-hidden="true" />
      <span><strong>{name}</strong> added to cart</span>
    </div>
  )
}

// ── Mobile FAB ─────────────────────────────────────────────────
function MobileCartFAB() {
  const { totalItems, totalPrice, openCart } = useCart()

  if (totalItems === 0) return null

  return (
    <button
      className="mobile-cart-fab"
      onClick={openCart}
      aria-label={`Open cart — ${totalItems} items, ₹${totalPrice.toLocaleString('en-IN')}`}
      id="mobile-cart-fab"
    >
      <span className="mobile-cart-fab-icon">
        <i className="fas fa-shopping-bag" aria-hidden="true" />
        <span className="mobile-cart-fab-badge">{totalItems > 99 ? '99+' : totalItems}</span>
      </span>
      <span className="mobile-cart-fab-info">
        <span className="mobile-cart-fab-label">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        <span className="mobile-cart-fab-price">₹{totalPrice.toLocaleString('en-IN')}</span>
      </span>
      <i className="fas fa-chevron-up mobile-cart-fab-arrow" aria-hidden="true" />
    </button>
  )
}

// ── Main Cart Drawer ───────────────────────────────────────────
export default function Cart() {
  const {
    items, totalItems, totalPrice, isOpen, toastData,
    closeCart, removeItem, updateQty, setQty, clearCart
  } = useCart()

  const [toastName, setToastName] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Show toast whenever toastData changes (includes timestamp to ensure repeated adds trigger it)
  useEffect(() => {
    if (!toastData) return
    setToastName(toastData.name)
    setToastVisible(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToastVisible(false), 2800)
  }, [toastData]) // eslint-disable-line react-hooks/exhaustive-deps


  const handleCheckout = () => {
    if (items.length === 0) return
    const msg = buildWhatsAppMessage(items, totalPrice)
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }

  const uniqueLines = items.length
  const totalSavingText = `${totalItems} item${totalItems !== 1 ? 's' : ''} · ${uniqueLines} product${uniqueLines !== 1 ? 's' : ''}`

  return (
    <>
      {/* ── Toast notification ── */}
      <CartToast name={toastName} visible={toastVisible} />

      {/* ── Mobile FAB ── */}
      <MobileCartFAB />

      {/* ── Overlay ── */}
      <div
        className={`cart-overlay${isOpen ? ' open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
        id="cart-overlay"
      />

      {/* ── Drawer ── */}
      <aside
        className={`cart-drawer${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-label="Shopping Cart"
        aria-modal="true"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="cart-drawer-head">
          <div>
            <h2 className="cart-drawer-title">
              <i className="fas fa-shopping-bag" aria-hidden="true" style={{ color: 'var(--gold)', fontSize: '1rem' }} />
              Your Cart
            </h2>
            {totalItems > 0 && (
              <p className="cart-drawer-subtitle">{totalSavingText}</p>
            )}
          </div>
          <button className="cart-close-btn" onClick={closeCart} aria-label="Close cart" id="cart-close-btn">
            <i className="fas fa-times" aria-hidden="true" />
          </button>
        </div>

        {/* Summary bar when items exist */}
        {items.length > 0 && (
          <div className="cart-summary-bar">
            <span className="cart-summary-label">
              <i className="fas fa-receipt" aria-hidden="true" />
              Order Summary
            </span>
            <span className="cart-summary-total">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Items */}
        {items.length === 0 ? (
          <div className="cart-empty" aria-live="polite">
            <div className="cart-empty-icon-wrap" aria-hidden="true">
              <i className="fas fa-shopping-bag cart-empty-icon" />
            </div>
            <p className="cart-empty-title">Your cart is empty</p>
            <p className="cart-empty-sub">Add some amazing products!</p>
            <button
              className="cart-empty-btn"
              onClick={closeCart}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-items" role="list" aria-label="Cart items">
            {items.map(item => (
              <div key={item.id} className="cart-item" role="listitem" id={`cart-item-${item.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.name} className="cart-item-img" />

                <div className="cart-item-info">
                  <p className="cart-item-category">{item.category}</p>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-country">{item.country}</p>

                  <div className="cart-item-price-row">
                    <span className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</span>
                    <span className="cart-item-each">/ each</span>
                  </div>

                  {/* Quantity stepper */}
                  <div className="cart-item-controls">
                    <div className="cart-qty-stepper">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, -1)}
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <i className="fas fa-minus" aria-hidden="true" />
                      </button>
                      <input
                        className="cart-qty-input"
                        type="number"
                        min={1}
                        max={99}
                        value={item.quantity}
                        onChange={e => {
                          const v = parseInt(e.target.value)
                          if (!isNaN(v)) setQty(item.id, v)
                        }}
                        aria-label={`Quantity for ${item.name}`}
                      />
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQty(item.id, +1)}
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <i className="fas fa-plus" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="cart-item-subtotal">
                      = <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.name}`}
                  id={`remove-${item.id}`}
                >
                  <i className="fas fa-trash-alt" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-foot">
            {/* Price breakdown */}
            <div className="cart-price-breakdown">
              <div className="cart-breakdown-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="cart-breakdown-row cart-breakdown-note">
                <span>Delivery charges</span>
                <span style={{ color: 'var(--gold)' }}>On enquiry</span>
              </div>
            </div>

            <div className="cart-total-row">
              <span className="cart-total-label">Estimated Total</span>
              <span className="cart-total-value">₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>

            <p className="cart-confirm-note">
              <i className="fas fa-info-circle" aria-hidden="true" />
              Final price &amp; availability confirmed via WhatsApp
            </p>

            <button
              className="cart-checkout-btn"
              onClick={handleCheckout}
              id="whatsapp-checkout-btn"
              aria-label="Order via WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order via WhatsApp
            </button>

            <button
              className="cart-clear-btn"
              onClick={clearCart}
              id="cart-clear-btn"
              aria-label="Clear all cart items"
            >
              <i className="fas fa-trash" aria-hidden="true" /> Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
