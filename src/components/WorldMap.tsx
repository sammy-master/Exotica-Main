'use client'

import { useEffect, useRef } from 'react'

const COUNTRIES = [
  {
    id: 'switzerland',
    name: 'Switzerland',
    flag: '🇨🇭',
    image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&q=80&w=800',
    products: 'Lindt, Toblerone, Nescafé',
    specialty: 'World-renowned chocolate & coffee',
  },
  {
    id: 'belgium',
    name: 'Belgium',
    flag: '🇧🇪',
    image: 'https://images.unsplash.com/photo-1549388604-817d15aa0110?auto=format&fit=crop&q=80&w=800',
    products: 'Godiva, Lotus Biscoff, Côte d\'Or',
    specialty: 'Finest pralines & biscuits',
  },
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&q=80&w=800',
    products: 'Monster, Prime, Pringles, Doritos',
    specialty: 'Energy drinks & iconic snacks',
  },
  {
    id: 'germany',
    name: 'Germany',
    flag: '🇩🇪',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800',
    products: 'Haribo, Kinder, Ferrero Rocher',
    specialty: 'Gummy candies & chocolate',
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800',
    products: 'KitKat Matcha, Pocky, Meiji',
    specialty: 'Unique flavours & collectibles',
  },
  {
    id: 'italy',
    name: 'Italy',
    flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1516483638261-f40889da1325?auto=format&fit=crop&q=80&w=800',
    products: 'Nutella, Kinder Joy',
    specialty: 'Confectionery excellence',
  },
]

export default function WorldMap() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    el.querySelectorAll('.reveal').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="world-section" id="world" ref={sectionRef} aria-label="Discover where products come from">
      <div className="world-inner">
        <div style={{ maxWidth: 680, marginBottom: 16, textAlign: 'center', margin: '0 auto' }}>
          <div className="section-label reveal" style={{ justifyContent: 'center' }}>
            <span className="gold-line" aria-hidden="true" style={{ width: 40 }} />
            Global Origins
            <span className="gold-line" aria-hidden="true" style={{ width: 40 }} />
          </div>
          <h2 className="section-title reveal reveal-delay-1" style={{ marginTop: 24 }}>
            From Every Corner<br />
            <em>of the Globe</em>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.9, marginTop: 16 }}>
            Our products travel thousands of kilometres to reach your hands. We source from the finest producing nations to bring you authentic international experiences.
          </p>
        </div>

        <div className="origins-grid reveal reveal-delay-3" style={{ marginTop: 64 }}>
          {COUNTRIES.map(c => (
            <div key={c.id} className="origin-card">
              <div className="origin-bg" style={{ backgroundImage: `url(${c.image})` }} />
              <div className="origin-overlay" />
              <div className="origin-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.4rem' }} aria-hidden="true">{c.flag}</span>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--text-primary)', margin: 0 }}>
                    {c.name}
                  </h3>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 600 }}>
                  {c.specialty}
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                  {c.products}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
