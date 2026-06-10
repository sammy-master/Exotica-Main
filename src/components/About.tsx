'use client'

import { useEffect, useRef } from 'react'

const features = [
  { icon: '🌍', num: '01', title: 'Globally Sourced', desc: 'Every product is carefully sourced from its country of origin — Switzerland, Belgium, USA, Japan and more.' },
  { icon: '✦',  num: '02', title: 'Authentic Brands', desc: 'We carry only genuine, internationally recognised brands. No knock-offs, no grey-market products.' },
  { icon: '✦',  num: '03', title: 'Premium Quality', desc: 'Our products are stored under ideal conditions to preserve freshness, flavour and quality from source to shelf.' },
  { icon: '🎯', num: '04', title: 'Curated Selection', desc: 'Our buying team handpicks products that are trending globally and hard to find locally in India.' },
  { icon: '🔥', num: '05', title: 'New Arrivals Daily', desc: 'Fresh shipments arrive regularly. Follow our Instagram to discover the latest viral international products.' },
  { icon: '🏪', num: '06', title: 'In-Store Experience', desc: 'Visit our flagship store at Shakuntal Commercia, Dehu-Alandi Road, PCMC — Mon to Sun, 10AM–9PM.' },
]

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="why-section" id="why" ref={sectionRef} aria-label="Why choose Exotica">
      <div className="why-bg-wrap" aria-hidden="true">
        <div className="why-bg-text">EXOTICA</div>
      </div>

      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ maxWidth: 680, marginBottom: 64 }}>
          <div className="section-label reveal">
            <span className="gold-line" aria-hidden="true" />
            Why Exotica
          </div>
          <h2 className="section-title reveal reveal-delay-1">
            Not Just a Store.<br />
            <em>A Premium Destination.</em>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.9, marginTop: 20 }}>
            Exotica PCMC is Pune&apos;s premier destination for discovering the world&apos;s finest imported treats. We bridge the gap between global food culture and your doorstep.
          </p>
        </div>

        <div className="why-grid">
          {features.map((f, i) => (
            <div
              key={i}
              className="why-card reveal"
              style={{ transitionDelay: `${i * 0.08}s` }}
              id={`why-card-${i + 1}`}
            >
              <span className="why-card-icon" aria-hidden="true">{f.icon}</span>
              <span className="why-card-num">{f.num}</span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
