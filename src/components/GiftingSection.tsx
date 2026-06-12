'use client'

import { useEffect, useRef, useState } from 'react'

const HAMPER_TYPES = [
  {
    id: 'birthday',
    icon: 'fas fa-birthday-cake',
    label: 'Birthday Specials',
    desc: 'Lindt, Ferrero, Kinder & more in luxury gift wrapping',
  },
  {
    id: 'corporate',
    icon: 'fas fa-briefcase',
    label: 'Corporate Gifting',
    desc: 'Branded hampers for Diwali, year-end, and bulk orders',
  },
  {
    id: 'anniversary',
    icon: 'fas fa-heart',
    label: 'Anniversary & Romance',
    desc: 'Premium chocolates, Godiva & imported candies for that special moment',
  },
  {
    id: 'custom',
    icon: 'fas fa-magic',
    label: 'Fully Custom',
    desc: 'Tell us your budget & we curate the perfect hamper',
  },
]

// Float products and Sparkles have been removed as per user request.

const WA_GIFTING = 'https://wa.me/919296909095?text=Hello%20Exotica!%20I%27m%20interested%20in%20a%20custom%20gift%20hamper.%20Please%20help%20me%20create%20one!'

export default function GiftingSection() {
  const ref = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState('')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = visualRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt(`perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03, 1.03, 1.03)`)
  }
  const onMouseLeave = () => setTilt('')

  return (
    <section className="gifting-section" id="gifting" aria-label="Gift hampers" ref={ref}>
      <div className="gifting-glow" aria-hidden="true" />

      <div className="gifting-inner">
        {/* ─── Left: Content ─── */}
        <div className="gifting-content reveal-left">
          <div className="section-label">
            <span className="gold-line" aria-hidden="true" />
            Bespoke Gifting
          </div>
          <h2 className="section-title gifting-title">
            The Gift That<br /><em>Travels the World</em>
          </h2>
          <p className="gifting-desc">
            Make every occasion extraordinary. Our curated hampers bring together the world&apos;s finest
            chocolates, premium beverages, and exotic treats — all wrapped in luxury, delivered to your
            door in PCMC, Pune.
          </p>

          <div className="gifting-types">
            {HAMPER_TYPES.map((h, i) => (
              <div
                key={h.id}
                className="gifting-type reveal"
                style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                id={`gift-type-${h.id}`}
              >
                <span className="gifting-type-icon-wrap">
                  <i className={h.icon} aria-hidden="true" />
                </span>
                <div>
                  <p className="gifting-type-label">{h.label}</p>
                  <p className="gifting-type-desc">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="gifting-cta reveal" style={{ transitionDelay: '0.55s' }}>
            <a
              href={WA_GIFTING}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              id="gifting-wa-btn"
              aria-label="Order a custom hamper via WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Build Your Hamper
            </a>
            <a href="tel:+919296909095" className="btn-ghost" id="gifting-call-btn" aria-label="Call Exotica PCMC">
              <i className="fas fa-phone" aria-hidden="true" />
              Or Call Us
            </a>
          </div>
        </div>

        {/* ─── Right: Visual panel ─── */}
        <div className="gifting-visual reveal-right">
          <div 
            ref={visualRef}
            className="gifting-visual-inner"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{ 
              transform: tilt, 
              transition: tilt ? 'transform 0.1s linear, box-shadow 0.4s' : 'transform 0.6s var(--ease), box-shadow 0.4s',
              boxShadow: tilt ? '0 30px 60px rgba(0,0,0,0.8), 0 0 40px rgba(212, 168, 67, 0.15)' : 'none'
            }}
          >

            {/* Gold corner frame */}
            <div className="gifting-frame" aria-hidden="true">
              <span className="gifting-frame-corner gifting-frame-tl" />
              <span className="gifting-frame-corner gifting-frame-tr" />
              <span className="gifting-frame-corner gifting-frame-bl" />
              <span className="gifting-frame-corner gifting-frame-br" />
            </div>

            {/* ═══ FLOAT ZONE — contains central icon and advanced animations ═══ */}
            <div className="gifting-float-zone" aria-hidden="true" style={{ position: 'relative', height: '260px' }}>

              {/* Advanced animated rings */}
              <div className="gifting-rings">
                <div className="gifting-ring gifting-ring-1" />
                <div className="gifting-ring gifting-ring-2" />
                <div className="gifting-ring gifting-ring-3" />
              </div>

              {/* Glowing Orb */}
              <div className="gifting-glow-orb" />

              {/* Central gift icon */}
              <div className="gifting-icon-display" aria-label="Premium gift hamper" style={{ position: 'relative', zIndex: 10 }}>
                <div className="gifting-icon-box">
                  <span className="gifting-pulse-ring gifting-pulse-ring-1" />
                  <span className="gifting-pulse-ring gifting-pulse-ring-2" />
                  <i className="fas fa-gift gifting-main-icon" />
                </div>
              </div>

            </div>{/* /gifting-float-zone */}

            {/* Stats — sits BELOW float zone, never overlapped */}
            <div className="gifting-stats">
              <div className="gifting-stat">
                <span className="gifting-stat-num">500+</span>
                <span className="gifting-stat-label">Hampers Delivered</span>
              </div>
              <div className="gifting-stat-div" aria-hidden="true" />
              <div className="gifting-stat">
                <span className="gifting-stat-num">₹499</span>
                <span className="gifting-stat-label">Starting Price</span>
              </div>
              <div className="gifting-stat-div" aria-hidden="true" />
              <div className="gifting-stat">
                <span className="gifting-stat-num">24h</span>
                <span className="gifting-stat-label">Custom Build Time</span>
              </div>
            </div>

            {/* Tag */}
            <div className="gifting-tag">
              <i className="fas fa-ribbon" aria-hidden="true" />
              Luxury Gift Wrapping Included
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
