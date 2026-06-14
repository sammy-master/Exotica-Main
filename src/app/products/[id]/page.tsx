'use client'

import { useState, useRef, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { PRODUCTS } from '@/data/products'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem, items, updateQty } = useCart()
  const product = PRODUCTS.find(p => p.id === id)

  useEffect(() => {
    if (!product) router.replace('/#products')
  }, [product, router])

  if (!product) return null

  return <ProductDetail product={product} />
}

// ─── Inner client component ──────────────────────────────────────────────────
function ProductDetail({ product }: { product: ReturnType<typeof PRODUCTS.find> & {} }) {
  const router = useRouter()
  const { addItem, items, updateQty } = useCart()
  const inCart   = items.find(i => i.id === product!.id)
  const inCartQty = inCart?.quantity ?? 0

  const allImages = [product!.image, ...(product!.images ?? [])].filter(Boolean) as string[]
  const [activeIdx, setActiveIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)

  // ── Pinch-to-zoom + swipe (same logic as before, now in a full page) ──
  const [mobileScale, setMobileScale] = useState(1)
  const [mobilePan,   setMobilePan]   = useState({ x: 0, y: 0 })
  const touchRef = useRef({
    startX: 0, startY: 0,
    startPanX: 0, startPanY: 0,
    startDist: 0, startScale: 1,
    lastTap: 0, isPinching: false,
  })
  const wrapRef = useRef<HTMLDivElement>(null)

  // Desktop zoom state
  const [zoomed,     setZoomed]     = useState(false)
  const [origin,     setOrigin]     = useState('50% 50%')
  const [pan,        setPan]        = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0, moved: false })

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768)
  }, [])

  const resetMobileZoom = () => { setMobileScale(1); setMobilePan({ x: 0, y: 0 }) }

  const handleSetActive = (idx: number) => {
    if (idx === activeIdx) return
    resetMobileZoom(); setZoomed(false); setPan({ x: 0, y: 0 })
    setImgLoaded(false); setActiveIdx(idx)
  }

  const getDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX
    const dy = t[0].clientY - t[1].clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const onTouchStart = (e: React.TouchEvent) => {
    const t = touchRef.current
    if (e.touches.length === 1) {
      t.startX = e.touches[0].clientX; t.startY = e.touches[0].clientY
      t.startPanX = mobilePan.x; t.startPanY = mobilePan.y
      t.isPinching = false
      const now = Date.now()
      if (now - t.lastTap < 280) {
        mobileScale > 1 ? resetMobileZoom() : setMobileScale(2.5)
      }
      t.lastTap = now
    } else if (e.touches.length === 2) {
      t.isPinching = true; t.startDist = getDist(e.touches); t.startScale = mobileScale
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const t = touchRef.current
    if (e.touches.length === 2 && t.isPinching) {
      e.preventDefault()
      const ratio = getDist(e.touches) / t.startDist
      setMobileScale(Math.min(Math.max(t.startScale * ratio, 1), 5))
    } else if (e.touches.length === 1 && mobileScale > 1.05) {
      e.preventDefault()
      setMobilePan({
        x: t.startPanX + e.touches[0].clientX - t.startX,
        y: t.startPanY + e.touches[0].clientY - t.startY,
      })
    }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const t = touchRef.current
    if (t.isPinching) { t.isPinching = false; return }
    if (mobileScale <= 1.05 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - t.startX
      const dy = e.changedTouches[0].clientY - t.startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
        dx < 0
          ? handleSetActive((activeIdx + 1) % allImages.length)
          : handleSetActive((activeIdx - 1 + allImages.length) % allImages.length)
      }
    }
    if (mobileScale < 1.15) resetMobileZoom()
  }

  // Desktop handlers
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved || isMobile) return
    const wrap = wrapRef.current; if (!wrap) return
    if (zoomed) { setZoomed(false); setPan({ x: 0, y: 0 }); setOrigin('50% 50%') }
    else {
      const r = wrap.getBoundingClientRect()
      setOrigin(`${((e.clientX - r.left) / r.width * 100).toFixed(1)}% ${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`)
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
    const dx = e.clientX - dragRef.current.startX, dy = e.clientY - dragRef.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragRef.current.moved = true
    setPan({ x: dragRef.current.startPanX + dx, y: dragRef.current.startPanY + dy })
  }
  const onPointerUp = () => { setIsDragging(false); setTimeout(() => { dragRef.current.moved = false }, 0) }

  const imgLabel = activeIdx === 0 ? 'Front' : activeIdx === 1 ? 'Back' : `Photo ${activeIdx + 1}`
  const imgTransform = isMobile
    ? (mobileScale !== 1 ? `scale(${mobileScale}) translate(${mobilePan.x / mobileScale}px, ${mobilePan.y / mobileScale}px)` : undefined)
    : (zoomed ? `scale(2.5) translate(${pan.x / 2.5}px, ${pan.y / 2.5}px)` : 'scale(1) translate(0,0)')

  return (
    <div className="pdp-root">
      {/* ── Sticky top bar ── */}
      <div className="pdp-topbar">
        <button className="pdp-back" onClick={() => router.back()} aria-label="Go back">
          <i className="fas fa-arrow-left" />
          <span>Back</span>
        </button>
        <span className="pdp-topbar-brand">Exotica PCMC</span>
        <div className="pdp-topbar-right">
          {inCartQty > 0 && (
            <span className="pdp-cart-badge">{inCartQty} in cart</span>
          )}
        </div>
      </div>

      <div className="pdp-layout">
        {/* ── LEFT: Image gallery (portrait) ── */}
        <div className="pdp-gallery">
          {/* Main image */}
          <div
            ref={wrapRef}
            className={`pdp-img-wrap${zoomed ? ' zoomed' : ''}`}
            onClick={handleClick}
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
              touchAction: 'none',
            }}
          >
            {!imgLoaded && <div className="pdp-img-skeleton" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={allImages[activeIdx]}
              src={allImages[activeIdx]}
              alt={`${product!.name} — ${imgLabel}`}
              className={`pdp-img${imgLoaded ? ' loaded' : ''}`}
              draggable={false}
              onLoad={() => setImgLoaded(true)}
              style={{
                transformOrigin: isMobile ? '50% 50%' : origin,
                transform: imgTransform,
                transition: (isDragging || (isMobile && mobileScale > 1))
                  ? 'opacity 0.3s'
                  : 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)',
              }}
            />

            {/* Desktop: zoom hint */}
            {!isMobile && !isDragging && (
              <div className="pdp-zoom-hint">
                <i className={`fas fa-${zoomed ? 'compress-alt' : 'search-plus'}`} />
                {zoomed ? 'Click to zoom out · Drag to pan' : 'Click to zoom in'}
              </div>
            )}

            {/* Arrow nav */}
            {allImages.length > 1 && (
              <>
                <button className="pdp-arrow pdp-arrow-left"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx - 1 + allImages.length) % allImages.length) }}
                  aria-label="Previous">
                  <i className="fas fa-chevron-left" />
                </button>
                <button className="pdp-arrow pdp-arrow-right"
                  onClick={e => { e.stopPropagation(); handleSetActive((activeIdx + 1) % allImages.length) }}
                  aria-label="Next">
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
          </div>

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <div className="pdp-dots">
              {allImages.map((_, i) => (
                <button key={i}
                  className={`pdp-dot${activeIdx === i ? ' active' : ''}`}
                  onClick={() => handleSetActive(i)}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* Thumbnail strip */}
          {allImages.length > 1 && (
            <div className="pdp-thumbs">
              {allImages.map((src, i) => (
                <button key={i}
                  className={`pdp-thumb${activeIdx === i ? ' active' : ''}`}
                  onClick={() => handleSetActive(i)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={`View ${i + 1}`} draggable={false} />
                  <span>{i === 0 ? 'Front' : i === 1 ? 'Back' : `#${i + 1}`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Product details ── */}
        <div className="pdp-details">
          <div className="pdp-meta-row">
            <span className="pdp-category">{product!.category}</span>
            <span className="pdp-country-badge">{product!.country}</span>
          </div>

          <h1 className="pdp-name">{product!.name}</h1>

          {product!.description && (
            <p className="pdp-desc">{product!.description}</p>
          )}

          <div className="pdp-price-row">
            <span className="pdp-price">₹{product!.price}</span>
            <span className="pdp-price-note">Incl. of all taxes</span>
          </div>

          {/* Cart controls */}
          <div className="pdp-cart-section">
            {inCartQty > 0 ? (
              <div className="pdp-stepper">
                <button className="pdp-step-btn" onClick={() => updateQty(product!.id, -1)} aria-label="Remove one">
                  <i className="fas fa-minus" />
                </button>
                <span className="pdp-step-qty">{inCartQty}</span>
                <button className="pdp-step-btn" onClick={() => updateQty(product!.id, 1)} aria-label="Add one">
                  <i className="fas fa-plus" />
                </button>
              </div>
            ) : (
              <button className="pdp-add-btn" onClick={() => addItem(product!, 1)}>
                <i className="fas fa-shopping-bag" />
                Add to Cart
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="pdp-divider" />

          {/* Ingredients */}
          {product!.ingredients && (
            <div className="pdp-ingredients">
              <h2 className="pdp-section-title">
                <i className="fas fa-leaf" /> Ingredients
              </h2>
              <p className="pdp-ingredients-text">{product!.ingredients}</p>
            </div>
          )}

          {/* Info pills */}
          <div className="pdp-info-pills">
            <div className="pdp-info-pill">
              <i className="fas fa-globe" />
              <div>
                <span className="pdp-pill-label">Origin</span>
                <span className="pdp-pill-value">{product!.country}</span>
              </div>
            </div>
            <div className="pdp-info-pill">
              <i className="fas fa-tag" />
              <div>
                <span className="pdp-pill-label">Category</span>
                <span className="pdp-pill-value">{product!.category}</span>
              </div>
            </div>
            <div className="pdp-info-pill">
              <i className="fas fa-truck" />
              <div>
                <span className="pdp-pill-label">Delivery</span>
                <span className="pdp-pill-value">PCMC Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
