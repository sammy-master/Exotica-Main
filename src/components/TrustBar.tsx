'use client'

import { useEffect, useRef } from 'react'

const BADGES = [
  {
    icon: 'fas fa-certificate',
    title: '100% Authentic',
    desc: 'Every product is genuine & imported directly',
    color: '#D4A843',
  },
  {
    icon: 'fas fa-shield-alt',
    title: 'FSSAI Licensed',
    desc: 'Reg. No. 21526038001776 — Govt. of Maharashtra',
    color: '#4FC3F7',
  },
  {
    icon: 'fas fa-globe-asia',
    title: '15+ Countries',
    desc: 'Curated treats from Switzerland, Belgium, Japan & more',
    color: '#A78BFA',
  },
  {
    icon: 'fas fa-bolt',
    title: 'Same Day Dispatch',
    desc: 'Order before 5 PM for same-day delivery in PCMC',
    color: '#4ADE80',
  },
]

export default function TrustBar() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    el.querySelectorAll('.trust-badge-card').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="trust-bar" id="trust" aria-label="Why trust Exotica" ref={ref}>
      <div className="trust-bar-inner">
        {BADGES.map((b, i) => (
          <div
            key={b.title}
            className="trust-badge-card reveal"
            style={{ transitionDelay: `${i * 0.1}s` }}
            id={`trust-badge-${i}`}
          >
            <div className="trust-badge-icon-wrap" style={{ '--badge-color': b.color } as React.CSSProperties}>
              <i className={b.icon} aria-hidden="true" />
            </div>
            <div className="trust-badge-text">
              <h3 className="trust-badge-title">{b.title}</h3>
              <p className="trust-badge-desc">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
