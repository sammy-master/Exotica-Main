'use client'

import { useState, useRef, useEffect } from 'react'
import { useCart, CartItem } from '@/context/CartContext'

type Product = Omit<CartItem, 'quantity'>

const PRODUCTS: Product[] = [
  // Chocolates
  { id: 'ferrero-rocher-16', name: 'Ferrero Rocher 16pc', price: 599, image: '/products/ferrero_premium.png', category: 'Chocolates', country: '🇮🇹 Italy' },
  { id: 'lindt-lindor-200',  name: 'Lindt Lindor Assorted 200g', price: 899, image: '/products/lindt_premium.png', category: 'Chocolates', country: '🇨🇭 Switzerland' },
  { id: 'toblerone-400',     name: 'Toblerone 400g', price: 799, image: '/products/toblerone_premium.png', category: 'Chocolates', country: '🇨🇭 Switzerland' },

  // Drinks
  { id: 'monster-original',  name: 'Monster Energy Original', price: 199, image: '/products/monster_premium.png', category: 'Drinks', country: '🇺🇸 USA' },
  { id: 'red-bull-250',      name: 'Red Bull 250ml', price: 175, image: '/products/redbull_premium.png', category: 'Drinks', country: '🇦🇹 Austria' },

  // Snacks
  { id: 'pringles-original', name: 'Pringles Original 165g', price: 299, image: '/products/pringles_premium.png', category: 'Snacks', country: '🇺🇸 USA' },

  // Candy
  { id: 'haribo-gold',       name: 'Haribo Gold Bears 200g', price: 249, image: '/products/haribo_premium.png', category: 'Candy', country: '🇩🇪 Germany' },
  { id: 'skittles-original', name: 'Skittles Original 196g', price: 199, image: '/products/skittles_premium.png', category: 'Candy', country: '🇺🇸 USA' },

  // Biscuits
  { id: 'oreo-double',       name: 'Oreo Double Stuf 432g', price: 399, image: '/products/oreo_premium.png', category: 'Biscuits', country: '🇺🇸 USA' },

  // Limited
  { id: 'kitkat-matcha',     name: 'KitKat Matcha Japan 12pc', price: 549, image: '/products/kitkat_premium.png', category: 'Limited', country: '🇯🇵 Japan' },
]

const CATEGORIES = ['All', 'Chocolates', 'Drinks', 'Snacks', 'Candy', 'Biscuits', 'Limited']

interface ProductCardProps {
  product: Product
  index: number
}

function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, items, openCart } = useCart()
  const [qty, setQty]         = useState(1)
  const [added, setAdded]     = useState(false)
  const cardRef               = useRef<HTMLDivElement>(null)
  const [tilt, setTilt]       = useState('')

  const inCart = items.find(i => i.id === product.id)
  const inCartQty = inCart?.quantity ?? 0

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current!.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    setTilt(`perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) scale3d(1.02,1.02,1.02)`)
  }
  const onMouseLeave = () => setTilt('')

  const handleAdd = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleViewCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    openCart()
  }

  const isLimited = product.category === 'Limited'
  const totalForQty = product.price * qty

  return (
    <div
      ref={cardRef}
      className="product-card reveal"
      style={{ transitionDelay: `${index * 0.06}s`, transform: tilt, transition: tilt ? 'transform 0.1s linear, border-color 0.4s, box-shadow 0.4s' : 'transform 0.6s var(--ease), border-color 0.4s, box-shadow 0.4s' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      id={`product-card-${product.id}`}
    >
      <div className="product-card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        <div className="product-card-overlay" />

        {/* Badges */}
        <div className="product-card-badges">
          {isLimited && <span className="product-card-badge badge-limited">Limited</span>}
          {inCartQty > 0 && (
            <span className="product-card-badge badge-incart" onClick={handleViewCart}>
              <i className="fas fa-check" aria-hidden="true" /> In Cart ({inCartQty})
            </span>
          )}
        </div>

        <span className="product-card-country">{product.country}</span>
      </div>

      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-footer">
          <div>
            <span className="product-price">₹{product.price}</span>
            <span className="product-per-unit"> / unit</span>
          </div>
          <div className="product-qty-wrap">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
            <span className="qty-display">{qty}</span>
            <button className="qty-btn" onClick={() => setQty(q => Math.min(q + 1, 99))} aria-label="Increase quantity">+</button>
          </div>
        </div>

        {/* Real-time total for selected qty */}
        {qty > 1 && (
          <div className="product-qty-total">
            <i className="fas fa-calculator" aria-hidden="true" />
            Total for {qty}: <strong>₹{totalForQty.toLocaleString('en-IN')}</strong>
          </div>
        )}

        <button
          className={`add-to-cart-btn${added ? ' added' : ''}`}
          onClick={handleAdd}
          id={`add-to-cart-${product.id}`}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? (
            <><i className="fas fa-check" aria-hidden="true" /> Added to Cart!</>
          ) : inCartQty > 0 ? (
            <><i className="fas fa-shopping-bag" aria-hidden="true" /> Add More</>
          ) : (
            <><i className="fas fa-shopping-bag" aria-hidden="true" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  )
}

export default function Products() {
  const [activeCat, setActiveCat] = useState('All')
  const { totalItems, totalPrice, openCart } = useCart()
  const sectionRef = useRef<HTMLElement>(null)

  const filtered = activeCat === 'All'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCat)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.reveal').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  })

  return (
    <section className="products-section" id="products" ref={sectionRef} aria-label="Shop products">
      <div className="products-header">
        <div className="reveal">
          <div className="section-label">
            <span className="gold-line" aria-hidden="true" />
            Shop Our Collection
          </div>
          <h2 className="section-title">
            The World&apos;s Finest,<br /><em>Delivered to PCMC</em>
          </h2>
        </div>

        <div className="category-filters reveal reveal-delay-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-filter-btn${activeCat === cat ? ' active' : ''}`}
              onClick={() => setActiveCat(cat)}
              id={`filter-${cat.toLowerCase()}`}
              aria-pressed={activeCat === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid" role="list" aria-label="Product list">
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      {/* Sticky cart bar when items in cart */}
      {totalItems > 0 && (
        <div className="products-cart-bar" id="products-cart-bar">
          <div className="products-cart-bar-inner">
            <div className="products-cart-bar-info">
              <i className="fas fa-shopping-bag" aria-hidden="true" />
              <span><strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} in cart</span>
            </div>
            <div className="products-cart-bar-right">
              <span className="products-cart-bar-total">₹{totalPrice.toLocaleString('en-IN')}</span>
              <button className="products-cart-bar-btn" onClick={openCart} id="products-view-cart-btn">
                View Cart <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
