'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { PRODUCTS, Product } from '@/data/products'

const CATEGORIES = ['All', 'Chocolates', 'Drinks', 'Candy', 'Biscuits', 'Other']

const CATEGORY_ICONS: Record<string, string> = {
  'All':        'fas fa-border-all',
  'Chocolates': 'fas fa-cube',
  'Drinks':     'fas fa-wine-bottle',
  'Candy':      'fas fa-candy-cane',
  'Biscuits':   'fas fa-cookie-bite',
  'Other':      'fas fa-star',
}

// â”€â”€â”€ Product Quick View Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface QuickViewProps {
  product: Product
  onClose: () => void
}

function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { addItem, items, updateQty } = useCart()
  const inCart = items.find(i => i.id === product.id)
  const inCartQty = inCart?.quantity ?? 0

  // Detect touch/mobile
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 640)
  }, [])

  // Image list
  const allImages = [product.image, ...(product.images ?? [])].filter(Boolean) as string[]
  const [activeIdx, setActiveIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  // â”€â”€ Desktop: click-to-zoom + drag-to-pan â”€â”€
  const ZOOM_SCALE = 2.5
  const [zoomed, setZoomed]       = useState(false)
  const [origin, setOrigin]       = useState('50% 50%')
  const [pan, setPan]             = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false })

  // â”€â”€ Mobile: pinch-to-zoom + swipe navigation â”€â”€
  const [mobileScale, setMobileScale] = useState(1)
  const [mobilePan,   setMobilePan]   = useState({ x: 0, y: 0 })
  const touchRef = useRef<{
    touches: React.Touch[]
    startDist: number
    startScale: number
    startX: number
    startY: number
    startPanX: number
    startPanY: number
    lastTap: number
    isPinching: boolean
  }>({
    touches: [], startDist: 0, startScale: 1,
    startX: 0, startY: 0, startPanX: 0, startPanY: 0,
    lastTap: 0, isPinching: false
  })
  const wrapRef = useRef<HTMLDivElement>(null)

  const resetMobileZoom = () => { setMobileScale(1); setMobilePan({ x: 0, y: 0 }) }

  const handleSetActive = (idx: number) => {
    if (idx === activeIdx) return
    setZoomed(false); setPan({ x: 0, y: 0 })
    resetMobileZoom()
    setImgLoaded(false); setActiveIdx(idx)
  }

  const getDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  // â”€â”€ Mobile touch handlers â”€â”€
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = touchRef.current
    if (e.touches.length === 1) {
      t.startX    = e.touches[0].clientX
      t.startY    = e.touches[0].clientY
      t.startPanX = mobilePan.x
      t.startPanY = mobilePan.y
      t.isPinching = false
      // Double-tap to zoom
      const now = Date.now()
      if (now - t.lastTap < 280) {
        if (mobileScale > 1) resetMobileZoom()
        else { setMobileScale(2.5); setMobilePan({ x: 0, y: 0 }) }
      }
      t.lastTap = now
    } else if (e.touches.length === 2) {
      t.isPinching  = true
      t.startDist   = getDist(e.touches)
      t.startScale  = mobileScale
    }
  }

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = touchRef.current
    if (e.touches.length === 2 && t.isPinching) {
      e.preventDefault()
      const newDist = getDist(e.touches)
      const ratio   = newDist / t.startDist
      const next    = Math.min(Math.max(t.startScale * ratio, 1), 5)
      setMobileScale(next)
    } else if (e.touches.length === 1 && mobileScale > 1.05) {
      // Pan when zoomed in
      e.preventDefault()
      const dx = e.touches[0].clientX - t.startX
      const dy = e.touches[0].clientY - t.startY
      setMobilePan({ x: t.startPanX + dx, y: t.startPanY + dy })
    }
  }

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = touchRef.current
    if (t.isPinching) { t.isPinching = false; return }
    // Swipe to navigate â€” only when not zoomed
    if (mobileScale <= 1.05 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - t.startX
      const dy = e.changedTouches[0].clientY - t.startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        if (dx < 0) handleSetActive((activeIdx + 1) % allImages.length)   // swipe left â†’ next
        else        handleSetActive((activeIdx - 1 + allImages.length) % allImages.length) // swipe right â†’ prev
      }
    }
    // Snap scale to 1 if pinched below threshold
    if (mobileScale < 1.15) resetMobileZoom()
  }

  // â”€â”€ Desktop pointer handlers â”€â”€
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved || isMobile) return
    const wrap = wrapRef.current
    if (!wrap) return
    if (zoomed) { setZoomed(false); setPan({ x: 0, y: 0 }); setOrigin('50% 50%') }
    else {
      const rect = wrap.getBoundingClientRect()
      setOrigin(`${((e.clientX - rect.left) / rect.width * 100).toFixed(1)}% ${((e.clientY - rect.top) / rect.height * 100).toFixed(1)}%`)
      setZoomed(true)
    }
  }
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!zoomed || isMobile) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPanX: pan.x, startPanY: pan.y, moved: false }
    setIsDragging(true)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    setPan({ x: dragRef.current.startPanX + dx, y: dragRef.current.startPanY + dy })
  }
  const onPointerUp = () => { setIsDragging(false); setTimeout(() => { dragRef.current.moved = false }, 0) }

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') handleSetActive((activeIdx + 1) % allImages.length)
      if (e.key === 'ArrowLeft')  handleSetActive((activeIdx - 1 + allImages.length) % allImages.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, activeIdx, allImages.length])

  const imgLabel = activeIdx === 0 ? 'Front' : activeIdx === 1 ? 'Back' : `Photo ${activeIdx + 1}`

  // Desktop transform
  const desktopTransform = zoomed
    ? `scale(${ZOOM_SCALE}) translate(${pan.x / ZOOM_SCALE}px, ${pan.y / ZOOM_SCALE}px)`
    : 'scale(1) translate(0,0)'

  // Mobile transform
  const mobileTransform = mobileScale !== 1 || mobilePan.x !== 0 || mobilePan.y !== 0
    ? `scale(${mobileScale}) translate(${mobilePan.x / mobileScale}px, ${mobilePan.y / mobileScale}px)`
    : undefined

  return (
    <div className="qv-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={product.name}>
      <div className="qv-modal" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button className="qv-close" onClick={onClose} aria-label="Close">
          <i className="fas fa-times" />
        </button>

        {/* â”€â”€ Image Gallery â”€â”€ */}
        <div className="qv-gallery">
          {/* Main image */}
          <div
            ref={wrapRef}
            className={`qv-img-wrap${zoomed ? ' zoomed' : ''}`}
            onClick={handleImageClick}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchStart={isMobile ? onTouchStart : undefined}
            onTouchMove={isMobile ? onTouchMove : undefined}
            onTouchEnd={isMobile ? onTouchEnd : undefined}
            style={{
              cursor: isMobile
                ? (mobileScale > 1 ? 'grab' : 'default')
                : (zoomed ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'),
              touchAction: isMobile ? 'none' : undefined,
              overflow: 'hidden',
            }}
          >
            {!imgLoaded && <div className="qv-img-skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={allImages[activeIdx]}
              src={allImages[activeIdx]}
              alt={`${product.name} â€” ${imgLabel}`}
              className={`qv-img${imgLoaded ? ' loaded' : ''}`}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
              style={{
                transformOrigin: isMobile ? '50% 50%' : origin,
                transform: isMobile ? mobileTransform : desktopTransform,
                transition: (isDragging || (isMobile && mobileScale > 1))
                  ? 'opacity 0.3s ease'
                  : 'opacity 0.4s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />

            {/* Country badge â€” desktop only, bottom-left */}
            {!isMobile && <span className="qv-country-badge">{product.country}</span>}

            {/* Photo label â€” desktop only (top-left, away from close btn) */}
            {!isMobile && <span className="qv-photo-label">{imgLabel}</span>}

            {/* Zoom hint â€” desktop only */}
            {!isMobile && !isDragging && (
              <div className="qv-zoom-hint">
                <i className={`fas fa-${zoomed ? 'compress-alt' : 'search-plus'}`} />
                {zoomed ? 'Click to zoom out Â· Drag to pan' : 'Click to zoom in'}
              </div>
            )}

            {/* Arrow nav â€” only if multiple images */}
            {allImages.length > 1 && (
              <>
                <button
                  className="qv-arrow qv-arrow-left"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx - 1 + allImages.length) % allImages.length) }}
                  aria-label="Previous photo"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  className="qv-arrow qv-arrow-right"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx + 1) % allImages.length) }}
                  aria-label="Next photo"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="qv-thumbs">
              {allImages.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`qv-thumb${activeIdx === idx ? ' active' : ''}`}
                  onClick={() => handleSetActive(idx)}
                  aria-label={idx === 0 ? 'Front photo' : idx === 1 ? 'Back photo' : `Photo ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`Thumbnail ${idx + 1}`} draggable={false} />
                  <span className="qv-thumb-label">
                    {idx === 0 ? 'Front' : idx === 1 ? 'Back' : `#${idx + 1}`}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Mobile: image counter dots */}
          {isMobile && allImages.length > 1 && (
            <div className="qv-mobile-dots">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`qv-dot${activeIdx === idx ? ' active' : ''}`}
                  onClick={() => handleSetActive(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile: gesture hint (shows once, fades) */}
          {isMobile && (
            <div className="qv-mobile-gesture-hint">
              <i className="fas fa-hand-pointer" /> Swipe to browse Â· Pinch to zoom Â· Double-tap to zoom
            </div>
          )}
        </div>

        {/* â”€â”€ Details Side â”€â”€ */}
        <div className="qv-details">
          {/* Mobile: country + current image label shown here cleanly */}
          {isMobile && (
            <div className="qv-mobile-meta">
              <span className="qv-mobile-country">{product.country}</span>
              <span className="qv-mobile-label">{imgLabel}</span>
            </div>
          )}
          <p className="qv-category">{product.category}</p>
          <h2 className="qv-name">{product.name}</h2>
          {product.description && <p className="qv-desc">{product.description}</p>}

          {/* Price + Cart controls */}
          <div className="qv-buy-row">
            <span className="qv-price">₹{product.price}</span>
            {inCartQty > 0 ? (
              <div className="qv-stepper">
                <button className="qv-step-btn" onClick={() => updateQty(product.id, -1)} aria-label="Decrease quantity">
                  <i className="fas fa-minus" />
                </button>
                <span className="qv-step-qty">{inCartQty}</span>
                <button className="qv-step-btn" onClick={() => updateQty(product.id, 1)} aria-label="Increase quantity">
                  <i className="fas fa-plus" />
                </button>
              </div>
            ) : (
              <button className="qv-add-btn" onClick={() => addItem(product, 1)}>
                <i className="fas fa-plus" /> Add
              </button>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="qv-ingredients">
              <h3 className="qv-ingredients-title">
                <i className="fas fa-leaf" /> Ingredients
              </h3>
              <p className="qv-ingredients-text">{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// â”€â”€â”€ Product Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface ProductCardProps {
  product: Product
  index: number
}

function ProductCard({ product, index }: ProductCardProps) {
  const { addItem, items, updateQty } = useCart()
  const router = useRouter()
  const [added, setAdded] = useState(false)

  const inCart = items.find(i => i.id === product.id)
  const inCartQty = inCart?.quantity ?? 0

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 800)
  }

  const handleIncrease = (e: React.MouseEvent) => { e.stopPropagation(); updateQty(product.id, 1) }
  const handleDecrease = (e: React.MouseEvent) => { e.stopPropagation(); updateQty(product.id, -1) }

  return (
    <div
      className="product-card reveal"
      style={{ transitionDelay: `${index * 0.04}s` }}
      id={`product-card-${product.id}`}
      onClick={() => router.push(`/products/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && router.push(`/products/${product.id}`)}
      aria-label={`View ${product.name} details`}
    >
      {/* Image */}
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
          <div className="product-card-img-placeholder" />
        )}
        <div className="product-card-overlay" />
        <span className="product-card-country">{product.country}</span>

        <div className="product-card-view-hint">
          <i className="fas fa-arrow-right" /> View Product
        </div>
      </div>

      {/* Body */}
      <div className="product-card-body">
        <p className="product-card-category">{product.category}</p>
        <h3 className="product-card-name">{product.name}</h3>

        <div className="product-card-footer">
          <span className="product-price">₹{product.price}</span>

          {/* Blinkit-style: show ADD or stepper */}
          {inCartQty > 0 ? (
            <div className="pc-stepper" onClick={e => e.stopPropagation()}>
              <button
                className="pc-step-btn"
                onClick={handleDecrease}
                aria-label="Remove one"
              >
                <i className="fas fa-minus" />
              </button>
              <span className="pc-step-qty">{inCartQty}</span>
              <button
                className="pc-step-btn"
                onClick={handleIncrease}
                aria-label="Add one more"
              >
                <i className="fas fa-plus" />
              </button>
            </div>
          ) : (
            <button
              className={`pc-add-btn${added ? ' pc-added' : ''}`}
              onClick={handleAdd}
              id={`add-to-cart-${product.id}`}
              aria-label={`Add ${product.name} to cart`}
            >
              {added ? <i className="fas fa-check" /> : <><i className="fas fa-plus" /> ADD</>}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// â”€â”€â”€ Main Products Section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
              placeholder="Search chocolates, drinks, snacksâ€¦"
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

      {PRODUCTS.length === 0 ? (
        <div className="products-coming-soon">
          <div className="coming-soon-icon"><i className="fas fa-box-open" aria-hidden="true" /></div>
          <h3 className="coming-soon-title">Products Coming Soon</h3>
          <p className="coming-soon-text">Our curated collection is being updated.<br />Visit the store or contact us to browse in person.</p>
          <a href="#contact" className="coming-soon-btn"><i className="fas fa-arrow-right" aria-hidden="true" /> Get in Touch</a>
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

      {/* Sticky cart bar */}
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

