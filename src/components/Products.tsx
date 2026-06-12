'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useCart, CartItem } from '@/context/CartContext'

type Product = Omit<CartItem, 'quantity'>

const PRODUCTS: Product[] = [
  { id: 'ex_001', name: 'Monster Ultra Roza', price: 200, image: '/products/exotica/exotica_003.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_002', name: 'Monster Ultra Peachy Keen', price: 200, image: '/products/exotica/exotica_001.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_003', name: 'Monster Ultra Strawberry Dreams', price: 220, image: '/products/exotica/exotica_002.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_004', name: 'Monster Punch MIXXD Energy', price: 180, image: '/products/exotica/exotica_004.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_005', name: 'Monster Pinepine Punch', price: 180, image: '/products/exotica/exotica_019.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_006', name: 'Monster Aussie Lemonade', price: 180, image: '/products/exotica/exotica_005.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_007', name: 'Monster Rio Punch', price: 180, image: '/products/exotica/exotica_011.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_008', name: 'Monster Mango Loco', price: 200, image: '/products/exotica/exotica_012.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_009', name: 'Monster Mariposa', price: 220, image: '/products/exotica/exotica_013.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_010', name: 'Monster Ultra Watermelon', price: 220, image: '/products/exotica/exotica_014.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_011', name: 'Monster Pacific Punch', price: 180, image: '/products/exotica/exotica_015.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_012', name: 'Monster Cosmic Peach', price: 180, image: '/products/exotica/exotica_016.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_013', name: 'Monster Energy White', price: 180, image: '/products/exotica/exotica_017.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_014', name: 'Monster Energy Original (Sugar-less)', price: 200, image: '/products/exotica/exotica_018.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_015', name: 'Monster Energy Nitro Super Dry', price: 180, image: '/products/exotica/exotica_006.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_016', name: 'Monster Khaotic Energy', price: 200, image: '/products/exotica/exotica_007.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_017', name: 'Monster Full Throttle Energy', price: 200, image: '/products/exotica/exotica_008.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_018', name: 'Monster VR46', price: 180, image: '/products/exotica/exotica_009.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_019', name: 'Monster Lando Norris', price: 180, image: '/products/exotica/exotica_010.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_020', name: 'Monster Ripper Energy', price: 250, image: '/products/exotica/exotica_036.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_021', name: 'Monster Ultra Fiesta Mango', price: 250, image: '/products/exotica/exotica_020.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_022', name: 'Monster Bad Apple', price: 280, image: '/products/exotica/exotica_028.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_023', name: 'RedBull Kratingdaeng', price: 250, image: '/products/exotica/exotica_029.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_024', name: 'RedBull Original', price: 280, image: '/products/exotica/exotica_030.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_025', name: 'RedBull Apple Muscat Grape', price: 250, image: '/products/exotica/exotica_031.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_026', name: 'RedBull Blueberry & Blackcurrant', price: 250, image: '/products/exotica/exotica_032.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_027', name: 'RedBull Summer Berry', price: 220, image: '/products/exotica/exotica_033.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_028', name: 'Milaf Cola', price: 220, image: '/products/exotica/exotica_034.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_029', name: 'Pepsi Zero Sugar Lime', price: 220, image: '/products/exotica/exotica_035.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_031', name: 'Coca-Cola Vanilla', price: 220, image: '/products/exotica/exotica_022.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_032', name: 'Fanta Grape', price: 150, image: '/products/exotica/exotica_023.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_033', name: 'Fanta Lychee', price: 150, image: '/products/exotica/exotica_024.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_034', name: 'Fanta Strawberry', price: 150, image: '/products/exotica/exotica_025.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_035', name: 'Mirinda Sarsaparilla', price: 120, image: '/products/exotica/exotica_026.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_036', name: 'Mirinda Orange', price: 120, image: '/products/exotica/exotica_027.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_037', name: 'Mirinda Pineapple', price: 120, image: '/products/exotica/exotica_058.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_038', name: 'Mirinda Cream Soda', price: 120, image: '/products/exotica/exotica_037.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_039', name: 'Dr Pepper & Cream Soda', price: 280, image: '/products/exotica/exotica_048.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_040', name: 'Glinter Sparkling Blueberry', price: 130, image: '/products/exotica/exotica_051.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_041', name: 'Vinut Popping Boba Strawberry', price: 150, image: '/products/exotica/exotica_052.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_042', name: 'Vinut Popping Boba Mango', price: 150, image: '/products/exotica/exotica_053.jpg', category: 'Drinks', country: 'Vietnam' },
  { id: 'ex_043', name: 'Kinza Cola', price: 130, image: '/products/exotica/exotica_054.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_044', name: 'Kinza Citrus', price: 130, image: '/products/exotica/exotica_055.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_045', name: 'Kinza Pomegranate', price: 130, image: '/products/exotica/exotica_056.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_046', name: 'Kinza Blackcurrant', price: 130, image: '/products/exotica/exotica_057.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_047', name: 'Kinza Lemon', price: 130, image: '/products/exotica/exotica_038.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_048', name: 'Kinza Orange', price: 130, image: '/products/exotica/exotica_039.jpg', category: 'Drinks', country: 'Saudi Arabia' },
  { id: 'ex_049', name: 'Mabu Coco Orange Juice', price: 100, image: '/products/exotica/exotica_040.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_050', name: 'Mabu Coco Pineapple Juice', price: 100, image: '/products/exotica/exotica_041.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_051', name: 'Mabu Coco Strawberry Juice', price: 100, image: '/products/exotica/exotica_042.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_052', name: 'Mabu Coco Lychee Juice', price: 100, image: '/products/exotica/exotica_043.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_053', name: 'Prime Hydration', price: 400, image: '/products/exotica/exotica_044.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_054', name: 'Nescafe Latte Can', price: 200, image: '/products/exotica/exotica_045.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_055', name: 'Starbucks Frappuccino Caramel', price: 350, image: '/products/exotica/exotica_046.jpg', category: 'Drinks', country: 'USA' },
  { id: 'ex_056', name: 'Nescafe Cappuccino Can', price: 200, image: '/products/exotica/exotica_047.jpg', category: 'Drinks', country: 'Thailand' },
  { id: 'ex_057', name: 'Rani Float Pineapple', price: 150, image: '/products/exotica/exotica_049.jpg', category: 'Drinks', country: 'UAE' },
  { id: 'ex_058', name: 'Rani Float Peach', price: 150, image: '/products/exotica/exotica_050.jpg', category: 'Drinks', country: 'UAE' },
  { id: 'ex_059', name: 'Lindt Excellence Chili Dark', price: 550, image: '/products/exotica/exotica_061.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_060', name: 'Lindt Excellence Raspberry Intense', price: 550, image: '/products/exotica/exotica_059.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_061', name: 'Lindt Excellence Caramel Sea Salt', price: 550, image: '/products/exotica/exotica_060.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_062', name: 'Lindt Lindor Milk Chocolate Bar', price: 950, image: '/products/exotica/exotica_073.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_063', name: 'Lindt Lindor Hazelnut Milk Bar', price: 950, image: '/products/exotica/exotica_062.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_064', name: 'Lindt Lindor 60% Dark Truffles Box', price: 799, image: '/products/exotica/exotica_065.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_065', name: 'Lindt Receta Original Dark 52%', price: 450, image: '/products/exotica/exotica_066.jpg', category: 'Chocolates', country: 'Spain' },
  { id: 'ex_066', name: 'Lindt Swiss Classic Fruit & Nut', price: 499, image: '/products/exotica/exotica_067.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_067', name: 'Lindt Swiss Classic Hazelnuts', price: 499, image: '/products/exotica/exotica_068.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_068', name: 'Lindt Swiss Classic Almond Hazelnut', price: 499, image: '/products/exotica/exotica_069.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_069', name: 'Lindt Receta Original Milk', price: 420, image: '/products/exotica/exotica_070.jpg', category: 'Chocolates', country: 'Spain' },
  { id: 'ex_070', name: 'Lindt Receta Original Hazelnut', price: 450, image: '/products/exotica/exotica_071.jpg', category: 'Chocolates', country: 'Spain' },
  { id: 'ex_071', name: 'Lindt Receta Hazelnut Milk (Large)', price: 699, image: '/products/exotica/exotica_072.jpg', category: 'Chocolates', country: 'Spain' },
  { id: 'ex_072', name: 'Lindt Lindor Assorted Truffles Box', price: 999, image: '/products/exotica/exotica_063.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_073', name: 'Lindt Lindor 70% Dark Truffles Box', price: 899, image: '/products/exotica/exotica_064.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_074', name: 'Lindt Lindor Milk Chocolate Box', price: 899, image: '/products/exotica/exotica_075.jpg', category: 'Chocolates', country: 'Switzerland' },
  { id: 'ex_075', name: 'Lindt Sensation Blueberry Acai', price: 650, image: '/products/exotica/exotica_074.jpg', category: 'Chocolates', country: 'Switzerland' },
]

const CATEGORIES = ['All', 'Chocolates', 'Drinks', 'Candy', 'Biscuits', 'Other']

// Font Awesome icon classes per category
const CATEGORY_ICONS: Record<string, string> = {
  'All':        'fas fa-border-all',
  'Chocolates': 'fas fa-cube',
  'Drinks':     'fas fa-wine-bottle',
  'Candy':      'fas fa-candy-cane',
  'Biscuits':   'fas fa-cookie-bite',
  'Other':      'fas fa-star',
}

interface ProductCardProps {
  product: Product
  index: number
}

function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, items, updateQty, openCart } = useCart()
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
    setQty(1)
  }

  const handleViewCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    openCart()
  }

  const handleIncrease = () => {
    if (inCartQty > 0) {
      updateQty(product.id, 1)
    } else {
      setQty(q => Math.min(q + 1, 99))
    }
  }

  const handleDecrease = () => {
    if (inCartQty > 0) {
      updateQty(product.id, -1)
    } else {
      setQty(q => Math.max(1, q - 1))
    }
  }

  const displayQty = inCartQty > 0 ? inCartQty : qty
  const isLimited = product.category === 'Limited'
  const totalForQty = product.price * displayQty

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
        {product.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={product.image}
            alt={product.name}
            className="product-card-img"
            loading="lazy"
          />
        ) : (
          <div className="product-card-img-placeholder" style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #111, #222)' }} />
        )}
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
            <button className="qty-btn" onClick={handleDecrease} aria-label="Decrease quantity">-</button>
            <span className="qty-display">{displayQty}</span>
            <button className="qty-btn" onClick={handleIncrease} aria-label="Increase quantity">+</button>
          </div>
        </div>

        {/* Real-time total for selected qty */}
        {displayQty > 1 && (
          <div className="product-qty-total">
            <i className="fas fa-calculator" aria-hidden="true" />
            Total for {displayQty}: <strong>₹{totalForQty.toLocaleString('en-IN')}</strong>
          </div>
        )}

        <button
          className={`add-to-cart-btn${added ? ' added' : ''}`}
          onClick={inCartQty > 0 ? handleViewCart : handleAdd}
          id={`add-to-cart-${product.id}`}
          aria-label={inCartQty > 0 ? `View ${product.name} in cart` : `Add ${product.name} to cart`}
        >
          {added ? (
            <><i className="fas fa-check" aria-hidden="true" /> Added to Cart!</>
          ) : inCartQty > 0 ? (
            <><i className="fas fa-shopping-bag" aria-hidden="true" /> View Cart</>
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
  const [searchQuery, setSearchQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(24)
  const { totalItems, totalPrice, openCart } = useCart()
  const sectionRef = useRef<HTMLElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCat && matchSearch
  })

  const visibleProducts = filtered.slice(0, visibleCount)

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setVisibleCount(24)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    searchRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleBrandSearch = (e: Event) => {
      const customEvent = e as CustomEvent<string>
      setSearchQuery(customEvent.detail)
      setActiveCat('All')
      setVisibleCount(24)
      const productsSection = document.getElementById('products')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    window.addEventListener('filterBrand', handleBrandSearch)
    return () => window.removeEventListener('filterBrand', handleBrandSearch)
  }, [])

  useEffect(() => {
    setVisibleCount(24)
  }, [activeCat])

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

        {/* Search bar */}
        <div className="products-search-wrap reveal reveal-delay-1">
          <div className="products-search-inner">
            <i className="fas fa-search products-search-icon" aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              className="products-search-input"
              placeholder="Search chocolates, drinks, snacks…"
              value={searchQuery}
              onChange={handleSearch}
              aria-label="Search products"
              id="products-search"
            />
            {searchQuery && (
              <button className="products-search-clear" onClick={clearSearch} aria-label="Clear search">
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <div className="category-filters reveal reveal-delay-2" role="group" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-filter-btn${activeCat === cat ? ' active' : ''}`}
              onClick={() => { setActiveCat(cat); setSearchQuery('') }}
              id={`filter-${cat.toLowerCase()}`}
              aria-pressed={activeCat === cat}
            >
              <i className={`${CATEGORY_ICONS[cat]} cat-icon`} aria-hidden="true" /> {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count — only show when products exist */}
      {PRODUCTS.length > 0 && (
        <div className="products-results-bar">
          <span className="products-results-count">
            {filtered.length === PRODUCTS.length
              ? `${PRODUCTS.length} products`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} found`}
          </span>
          {searchQuery && (
            <span className="products-results-query">for &ldquo;<strong>{searchQuery}</strong>&rdquo;</span>
          )}
        </div>
      )}

      {/* Coming Soon state — shown when no products are loaded */}
      {PRODUCTS.length === 0 ? (
        <div className="products-coming-soon">
          <div className="coming-soon-icon">
            <i className="fas fa-box-open" aria-hidden="true" />
          </div>
          <h3 className="coming-soon-title">Products Coming Soon</h3>
          <p className="coming-soon-text">
            Our curated collection is being updated.<br />
            Visit the store or contact us to browse in person.
          </p>
          <a href="#contact" className="coming-soon-btn">
            <i className="fas fa-arrow-right" aria-hidden="true" /> Get in Touch
          </a>
        </div>
      ) : (
        <>
          <div className="products-grid" role="list" aria-label="Product list">
            {visibleProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
            {filtered.length === 0 && (
              <div className="products-no-results">
                <i className="fas fa-search" aria-hidden="true" />
                <p>No products found for &ldquo;<strong>{searchQuery}</strong>&rdquo;</p>
                <button className="cat-filter-btn" onClick={clearSearch}>Clear Search</button>
              </div>
            )}
          </div>

          {visibleCount < filtered.length && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
              <button
                className="cat-filter-btn"
                style={{ padding: '14px 40px', fontSize: '0.85rem' }}
                onClick={() => setVisibleCount(v => v + 24)}
                aria-label="Load more products"
              >
                Load More Products
              </button>
            </div>
          )}
        </>
      )}

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
