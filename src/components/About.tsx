'use client'

import { useEffect, useRef } from 'react'

const PILLARS = [
  {
    num: '01',
    icon: 'fas fa-globe-asia',
    title: 'Globally Sourced',
    desc: 'Every product originates from its home country — Switzerland, Belgium, Japan, USA, South Korea and beyond.',
  },
  {
    num: '02',
    icon: 'fas fa-award',
    title: 'Authentic Brands',
    desc: 'We carry only genuine, internationally recognised labels. Zero knock-offs, zero grey-market products — ever.',
  },
  {
    num: '03',
    icon: 'fas fa-snowflake',
    title: 'Freshness Assured',
    desc: 'Products are stored under ideal conditions, preserving the flavour and quality from source to shelf.',
  },
  {
    num: '04',
    icon: 'fas fa-fire',
    title: 'New Drops Daily',
    desc: 'Fresh shipments arrive regularly. Follow our Instagram for live stock drops and limited-edition reveals.',
  },
]

const STATS = [
  { num: '500+', label: 'Products' },
  { num: '15+', label: 'Countries' },
  { num: '2,000+', label: 'Happy Customers' },
  { num: '4.7★', label: 'Avg. Rating' },
]

export default function About() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    )
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="about-section" id="about" aria-label="About Exotica PCMC" ref={ref}>

      {/* Background watermark */}
      <div className="about-bg-word" aria-hidden="true">EXOTICA</div>
      <div className="about-glow-left"  aria-hidden="true" />
      <div className="about-glow-right" aria-hidden="true" />

      <div className="about-inner">

        {/* ── Top: Story & Image ── */}
        <div className="about-story">

          {/* Left: text */}
          <div className="about-text-content reveal-left">
            <div className="section-label">
              <span className="gold-line" aria-hidden="true" />
              Our Story
            </div>
            <h2 className="section-title about-title">
              Bringing the World&apos;s<br /><em>Finest Tastes</em> to PCMC
            </h2>
            <p className="about-body">
              Started with a passion for premium global confectionery, <strong>Exotica PCMC</strong> was born out of the desire to bridge the gap between local cravings and international luxury. We realized that finding authentic imported chocolates and exotic beverages often meant paying exorbitant shipping fees or traveling far.
            </p>
            <p className="about-body" style={{ marginTop: 16 }}>
              Nestled inside <strong>Shakuntal Commercia</strong>{' '} on Dehu-Alandi Road, our store is a curated experience - every shelf tells a story of a different country. Whether you&apos;re hunting for viral Japanese KitKats, rare Kinder variants, or premium Godiva selections, Exotica is your first - and last - stop.
            </p>

            {/* Pull-quote */}
            <blockquote className="about-quote reveal" style={{ transitionDelay: '0.2s' }}>
              <i className="fas fa-quote-left about-quote-icon" aria-hidden="true" />
              One Brand. Endless Flavours.
            </blockquote>

            {/* Store info chips */}
            <div className="about-chips reveal" style={{ transitionDelay: '0.28s' }}>
              <div className="about-chip">
                <i className="fas fa-map-marker-alt" aria-hidden="true" />
                Shop 24B, Shakuntal Commercia, Dehu-Alandi Rd, Chikhali, PCMC 411062
              </div>
              <div className="about-chip">
                <i className="fas fa-clock" aria-hidden="true" />
                Mon – Sun · 10 AM – 9 PM
              </div>
              <div className="about-chip">
                <i className="fas fa-shield-alt" aria-hidden="true" />
                FSSAI Lic. 21526038001776
              </div>
              <div className="about-chip">
                <i className="fas fa-file-invoice" aria-hidden="true" />
                GST: 27AAMFE9994K1ZE
              </div>
            </div>
          </div>

          {/* Right: stat panel */}
          <div className="about-stat-panel reveal-right">
            <div className="about-stat-panel-inner">
              {/* Corner accents */}
              <span className="about-corner about-corner-tl" aria-hidden="true" />
              <span className="about-corner about-corner-tr" aria-hidden="true" />
              <span className="about-corner about-corner-bl" aria-hidden="true" />
              <span className="about-corner about-corner-br" aria-hidden="true" />

              <p className="about-stat-eyebrow">By the numbers</p>

              <div className="about-stats-grid">
                {STATS.map((s, i) => (
                  <div className="about-stat-item reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                    <span className="about-stat-num">{s.num}</span>
                    <span className="about-stat-label">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="about-stat-divider" aria-hidden="true" />

              <p className="about-stat-note">
                Trusted by thousands of families across PCMC, Pune — for gifting, personal indulgence, and corporate orders.
              </p>

              <a
                href="https://wa.me/919296909095?text=Hello%20Exotica!%20I%27d%20like%20to%20know%20more%20about%20your%20store."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold about-cta-btn"
                id="about-wa-btn"
                aria-label="Chat with Exotica PCMC on WhatsApp"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Say Hello
              </a>
            </div>
          </div>
        </div>

        {/* ── Bottom: 4 Pillars ── */}
        <div className="about-pillars">
          {PILLARS.map((p, i) => (
            <div
              key={p.num}
              className="about-pillar reveal"
              style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
              id={`about-pillar-${i + 1}`}
            >
              <div className="about-pillar-head">
                <div className="about-pillar-icon-wrap">
                  <i className={p.icon} aria-hidden="true" />
                </div>
                <span className="about-pillar-num">{p.num}</span>
              </div>
              <h3 className="about-pillar-title">{p.title}</h3>
              <p className="about-pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
