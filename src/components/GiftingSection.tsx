'use client'

import { useEffect, useRef } from 'react'

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

// ─── Float products — x/y are % inside gifting-float-zone only ───────────────
// Zone is ~260px tall × full width. Centre icon sits at ~50%, 50%.
// Images are placed in corners and mid-edges, clear of centre icon.
const FLOAT_PRODUCTS = [
  // top-left (KitKat)
  { src: '/floats/kitkat.png',    alt: 'KitKat',         size: 66, x: '8%',  y: '12%', delay: 0,    duration: 6  },
  // top-right (Ferrero)
  { src: '/floats/ferrero.png',   alt: 'Ferrero Rocher', size: 70, x: '75%', y: '12%', delay: -1.8, duration: 7  },
  // bottom-right (Lindt)
  { src: '/floats/lindt.png',     alt: 'Lindt Lindor',   size: 62, x: '80%', y: '65%', delay: -3.2, duration: 8  },
  // bottom-left (Toblerone)
  { src: '/floats/toblerone.png', alt: 'Toblerone',      size: 58, x: '10%', y: '65%', delay: -2,   duration: 9  },
  // top-centre (Godiva)
  { src: '/floats/godiva.png',    alt: 'Godiva',         size: 56, x: '42%', y: '2%',  delay: -4.5, duration: 7  },
]

// Sparkles — all within float zone
const SPARKLES = [
  { x: '22%', y: '30%', size: 14, delay: 0,    dur: 2.6 },
  { x: '78%', y: '28%', size: 11, delay: -0.9, dur: 3.2 },
  { x: '70%', y: '72%', size: 13, delay: -1.7, dur: 2.8 },
  { x: '30%', y: '68%', size: 10, delay: -2.3, dur: 3.6 },
  { x: '50%', y: '22%', size: 16, delay: -0.4, dur: 2.3 },
  { x: '16%', y: '55%', size: 9,  delay: -3.1, dur: 3.0 },
]

const WA_GIFTING = 'https://wa.me/919296909095?text=Hello%20Exotica!%20I%27m%20interested%20in%20a%20custom%20gift%20hamper.%20Please%20help%20me%20create%20one!'

function Sparkle({ x, y, size, delay, dur }: { x: string; y: string; size: number; delay: number; dur: number }) {
  const s = size, h = s / 2, q = s / 4
  const path = `M${h},0 L${h + q * 0.35},${h - q * 0.35} L${s},${h} L${h + q * 0.35},${h + q * 0.35} L${h},${s} L${h - q * 0.35},${h + q * 0.35} L0,${h} L${h - q * 0.35},${h - q * 0.35} Z`
  return (
    <svg
      className="gifting-sparkle"
      width={s} height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', animationDelay: `${delay}s`, animationDuration: `${dur}s` }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`sg-${delay}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#FBF0D5" stopOpacity="1" />
          <stop offset="55%"  stopColor="#D4A843" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#9A7420" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={path} fill={`url(#sg-${delay})`} />
    </svg>
  )
}

export default function GiftingSection() {
  const ref = useRef<HTMLElement>(null)

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

  return (
    <section className="gifting-section" id="gifting" aria-label="Gift hampers" ref={ref}>
      <div className="gifting-glow" aria-hidden="true" />

      <div className="gifting-inner">
        {/* ── Left: Content ── */}
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

        {/* ── Right: Visual panel ── */}
        <div className="gifting-visual reveal-right">
          <div className="gifting-visual-inner">

            {/* Gold corner frame */}
            <div className="gifting-frame" aria-hidden="true">
              <span className="gifting-frame-corner gifting-frame-tl" />
              <span className="gifting-frame-corner gifting-frame-tr" />
              <span className="gifting-frame-corner gifting-frame-bl" />
              <span className="gifting-frame-corner gifting-frame-br" />
            </div>

            {/* ═══ FLOAT ZONE — contains ALL floats, clips at boundary ═══ */}
            <div className="gifting-float-zone" aria-hidden="true">

              {/* SVG sparkles */}
              {SPARKLES.map((sp, i) => (
                <Sparkle key={i} {...sp} />
              ))}

              {/* Floating chocolate product images */}
              {FLOAT_PRODUCTS.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={p.src}
                  src={p.src}
                  alt={p.alt}
                  width={p.size}
                  height={p.size}
                  className="gifting-float-img"
                  style={{
                    left: p.x,
                    top: p.y,
                    width: p.size,
                    height: p.size,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                  }}
                  loading="lazy"
                />
              ))}

              {/* Central gift icon — inside zone so floats frame it */}
              <div className="gifting-icon-display" aria-label="Premium gift hamper">
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
