'use client'

import { useEffect, useRef, useState } from 'react'

function AnimatedNumber({ value }: { value: string }) {
  const [count, setCount] = useState(0)
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const suffix = value.replace(/[0-9]/g, '')
  
  useEffect(() => {
    const duration = 2500
    const startTime = performance.now()
    let frameId: number
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(easeOut * target))
      
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }
    
    // Start animation slightly after page load so it runs exactly as the text fades in
    const timeout = setTimeout(() => {
      frameId = requestAnimationFrame(animate)
    }, 800)
    
    return () => {
      clearTimeout(timeout)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [target])

  return <>{count}{suffix}</>
}

const stats = [
  { num: '100+',  label: 'Global Brands'     },
  { num: '1500+', label: 'Happy Customers'   },
  { num: '40+',   label: 'Countries Sourced' },
]

export default function Hero() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const sectionRef   = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const container = particlesRef.current
    if (!container) return
    const COUNT = 120
    for (let i = 0; i < COUNT; i++) {
      const p    = document.createElement('div')
      p.className = 'hero-particle'
      const isLarge = Math.random() > 0.85
      const size  = isLarge ? (Math.random() * 5 + 3).toFixed(1) : (Math.random() * 2 + 1.5).toFixed(1)
      const opac  = isLarge ? (Math.random() * 0.3 + 0.7).toFixed(2) : (Math.random() * 0.4 + 0.3).toFixed(2)
      const glow  = isLarge ? 16 : 6
      const blur  = isLarge && Math.random() > 0.5 ? 'blur(1px)' : 'none'
      const x     = Math.random() * 100
      const y     = Math.random() * 100
      const dur   = (Math.random() * 10 + 6).toFixed(1)
      const delay = (Math.random() * 15).toFixed(1)
      p.style.cssText = `width:${size}px;height:${size}px;left:${x}%;top:${y}%;--dur:${dur}s;--delay:-${delay}s;--max-opacity:${opac};animation-delay:-${delay}s;box-shadow:0 0 ${glow}px var(--gold-light);filter:${blur};`
      container.appendChild(p)
    }
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="hero" id="hero" ref={sectionRef} aria-label="Exotica PCMC — Hero">

      {/* ── Background is handled via CSS / Particles ── */}

      {/* ── Particles ── */}
      <div className="hero-particles" ref={particlesRef} aria-hidden="true" />

      {/* ══════════════════════════════════
          Text Content
          ══════════════════════════════════ */}
      <div className="hero-content">

        <div className="hero-eyebrow reveal">
          <span className="gold-line" aria-hidden="true" />
          Premium Imported Goods &nbsp;·&nbsp; PCMC, Pune
          <span className="gold-line" aria-hidden="true" />
        </div>

        <h1 className="hero-title reveal reveal-delay-1" id="hero-title">
          EXOTICA
        </h1>

        <p className="hero-taglines reveal reveal-delay-2">
          Imported Chocolates.&nbsp; Premium Drinks.&nbsp; Global Treats.
        </p>

        <p className="hero-subtitle reveal reveal-delay-3" id="hero-subtitle">
          Discover exclusive international products curated from around the world — Belgian chocolates, American energy drinks, Japanese snacks &amp; more.
        </p>

        <div className="hero-actions reveal reveal-delay-4" id="hero-actions">
          <a href="#products" className="btn-gold" id="hero-explore-btn">
            Explore Collection
          </a>
          <a href="#contact" className="btn-ghost" id="hero-visit-btn">
            Visit Store <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="hero-stats reveal reveal-delay-5" id="hero-stats" role="list">
          {stats.map(({ num, label }, i) => (
            <div key={i} className="hero-stat" role="listitem">
              <span className="hero-stat-num"><AnimatedNumber value={num} /></span>
              <span className="hero-stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>



    </section>
  )
}
