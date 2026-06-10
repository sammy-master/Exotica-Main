'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

interface Card {
  id: string
  image: string
  alt: string
  category: string
  title: string
  desc: string
  tags: string[]
  waMsg: string
  large?: boolean
}

const cards: Card[] = [
  {
    id: 'card-choc',
    image: '/images/chocolates-collection.jpg',
    alt: 'Imported Chocolates Collection',
    category: 'Confectionery',
    title: 'Imported Chocolates',
    desc: "Belgian, Swiss, Belgian, American — the finest cocoa creations from the world's chocolate capitals",
    tags: ['Belgian', 'Swiss', 'Truffle', 'Dark'],
    waMsg: "Hi! I'm interested in your imported chocolates",
    large: true,
  },
  {
    id: 'card-drinks',
    image: '/images/drinks-collection.jpg',
    alt: 'Exotic Beverages Collection',
    category: 'Beverages',
    title: 'Exotic Beverages',
    desc: 'Premium energy drinks, rare sodas & exotic juices from across the globe',
    tags: ['Energy', 'Rare', 'Premium'],
    waMsg: "Hi! I'm interested in your exotic beverages",
  },
  {
    id: 'card-snacks',
    image: '/images/snacks-collection.jpg',
    alt: 'Premium Snacks Collection',
    category: 'Snacks',
    title: 'Global Snacks',
    desc: "Viral chips, exotic crackers & international snacks you can't find anywhere else",
    tags: ['Viral', 'Exotic', 'Limited'],
    waMsg: "Hi! I'm interested in your snack collection",
  },
]

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

export default function Collections() {
  const gridRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

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

  // 3D tilt
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cardEls = grid.querySelectorAll<HTMLElement>('.collection-card:not(.card-special)')
    const handlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = []

    cardEls.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        const rotX = clamp(-dy * 6, -8, 8)
        const rotY = clamp(dx * 6, -8, 8)
        card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`
      }
      const leave = () => { card.style.transform = '' }
      card.addEventListener('mousemove', move)
      card.addEventListener('mouseleave', leave)
      handlers.push({ el: card, move, leave })
    })

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
    }
  }, [])

  return (
    <section className="collections" id="collections" ref={sectionRef}>
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 32px' }}>
        <div className="section-header reveal" id="collections-header">
          <div className="section-tag">Our Collections</div>
          <h2 className="section-title">Explore the <em>World&apos;s Finest</em></h2>
          <p style={{ fontSize: '1rem', color: 'rgba(240,236,228,0.65)', maxWidth: 520, margin: '0 auto' }}>
            Handpicked from across the globe — every bite tells a story
          </p>
        </div>

        <div className="collections-grid" id="collections-grid" ref={gridRef}>
          {cards.map((card) => (
            <div
              className={`collection-card reveal${card.large ? ' card-large' : ''}`}
              id={card.id}
              key={card.id}
            >
              {/* Image wrapper — position relative so fill works */}
              <div className="card-img-wrap" style={{ position: 'relative' }}>
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  style={{ objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.22,1,0.36,1)' }}
                  className="card-img-el"
                />
                <div className="card-overlay" />
              </div>

              <div className="card-content">
                <span className="card-category">{card.category}</span>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-desc">{card.desc}</p>
                <div className="card-tags">
                  {card.tags.map((tag) => (
                    <span className="card-tag" key={tag}>{tag}</span>
                  ))}
                </div>
                <a
                  href={`https://wa.me/919296909095?text=${encodeURIComponent(card.waMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-btn"
                  id={`${card.id}-order-btn`}
                >
                  <span>Enquire Now</span>
                  <i className="fas fa-arrow-right card-btn-icon" />
                </a>
              </div>
            </div>
          ))}

          {/* Special Card */}
          <div className="collection-card card-special reveal" id="card-special">
            <div className="card-special-inner">
              <div className="card-special-glow" />
              <div className="special-icon">
                <i className="fas fa-fire-flame-curved" />
              </div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: 14 }}>
                New Arrivals
              </h3>
              <p style={{ fontSize: '0.83rem', color: 'rgba(240,236,228,0.65)', lineHeight: 1.7, marginBottom: 28 }}>
                Fresh viral products added to our shelves daily. Follow us on Instagram to stay updated!
              </p>
              <a
                href="https://www.instagram.com/exotica.pcmc/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold"
                id="card-special-ig-btn"
              >
                <i className="fab fa-instagram" /> View on Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
