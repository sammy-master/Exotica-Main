'use client'

import { useEffect, useRef } from 'react'

const expCards = [
  {
    id: 'exp-card-1',
    icon: 'fas fa-globe-asia',
    title: 'Global Sourcing',
    desc: "We travel the world (figuratively) so you don't have to. Every product is sourced from its country of origin.",
  },
  {
    id: 'exp-card-2',
    icon: 'fas fa-medal',
    title: 'Premium Only',
    desc: "We stock only the finest. If it's on our shelf, it's passed our rigorous quality and authenticity check.",
  },
  {
    id: 'exp-card-3',
    icon: 'fas fa-bolt',
    title: 'Always Fresh',
    desc: 'New viral and trending international products hit our shelves daily. There\'s always something new to discover.',
  },
  {
    id: 'exp-card-4',
    icon: 'fas fa-comments',
    title: 'DM to Order',
    desc: "Can't visit? Simply DM us on Instagram or WhatsApp and we'll arrange your favourite treats for pickup or delivery.",
  },
  {
    id: 'exp-card-5',
    icon: 'fas fa-tags',
    title: 'Best Prices',
    desc: "Imported doesn't mean unaffordable. We offer the most competitive prices on premium international products in PCMC.",
  },
  {
    id: 'exp-card-6',
    icon: 'fas fa-map-marker-alt',
    title: 'Prime Location',
    desc: 'Located at Shakuntal Commercia, Dehu-Alandi Road — easily accessible from all parts of Pimpri-Chinchwad.',
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const targets = el.querySelectorAll('.reveal')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    targets.forEach((t) => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  // Mouse spotlight on cards
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>('.exp-card')
    const handlers: { el: HTMLElement; fn: (e: MouseEvent) => void }[] = []
    cards.forEach((card) => {
      const fn = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        card.style.setProperty('--mx', `${x}%`)
        card.style.setProperty('--my', `${y}%`)
      }
      card.addEventListener('mousemove', fn)
      handlers.push({ el: card, fn })
    })
    return () => handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn))
  }, [])

  return (
    <section className="experience" id="experience" ref={sectionRef}>
      <div className="exp-bg-text">EXOTICA</div>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 32px' }}>
        <div className="section-header reveal" id="exp-header">
          <div className="section-tag">Why Choose Us</div>
          <h2 className="section-title">The <em>Exotica</em> Experience</h2>
        </div>
        <div className="exp-grid stagger" id="exp-grid" ref={gridRef}>
          {expCards.map((card) => (
            <div className="exp-card reveal" id={card.id} key={card.id}>
              <div className="exp-icon">
                <i className={card.icon} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
