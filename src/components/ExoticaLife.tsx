'use client'

import { useEffect, useRef } from 'react'

interface LifePost {
  id: string
  src: string
  alt: string
  tag: string
  span?: 'tall' | 'wide' | 'default'
  href: string
}

// Real posts downloaded from @exotica.pcmc Instagram
const POSTS: LifePost[] = [
  {
    id: 'post-1',
    src: '/insta/post1.jpg',
    alt: 'Exotica PCMC — Premium imported products',
    tag: 'Latest Drop',
    span: 'tall',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
  {
    id: 'post-2',
    src: '/insta/post2.jpg',
    alt: 'Exotica PCMC — Imported chocolates & treats',
    tag: 'Chocolates',
    span: 'default',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
  {
    id: 'post-3',
    src: '/insta/post3.jpg',
    alt: 'Exotica PCMC — Exotic snacks collection',
    tag: 'Snacks',
    span: 'default',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
  {
    id: 'post-4',
    src: '/insta/post4.jpg',
    alt: 'Exotica PCMC — Imported beverages',
    tag: 'Beverages',
    span: 'wide',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
  {
    id: 'post-5',
    src: '/insta/post5.jpg',
    alt: 'Exotica PCMC — Gift hampers',
    tag: 'Gifting',
    span: 'default',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
  {
    id: 'post-6',
    src: '/insta/post6.jpg',
    alt: 'Exotica PCMC — Limited edition imports',
    tag: 'Limited Edition',
    span: 'default',
    href: 'https://www.instagram.com/exotica.pcmc/',
  },
]

export default function ExoticaLife() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          obs.unobserve(e.target)
        }
      }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    // Observe BOTH the header and all cards
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .exlife-card').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="exlife-section" id="exotica-life" aria-label="Exotica Life — our world" ref={ref}>
      <div className="exlife-inner">

        {/* ── Header — observe via .reveal ── */}
        <div className="exlife-header">
          <div className="section-label reveal" style={{ transitionDelay: '0s' }}>
            <span className="gold-line" aria-hidden="true" />
            Exotica Life
          </div>
          <h2 className="section-title reveal" style={{ transitionDelay: '0.1s' }}>
            As Seen on <em>Instagram</em>
          </h2>
          <p className="exlife-subtitle reveal" style={{ transitionDelay: '0.18s' }}>
            Real posts from our store — every bite, every sip, every limited drop.
            Follow us for daily updates from Shakuntal Commercia, PCMC.
          </p>
          <a
            href="https://www.instagram.com/exotica.pcmc/"
            target="_blank"
            rel="noopener noreferrer"
            className="exlife-ig-link reveal"
            id="exlife-ig-link"
            style={{ transitionDelay: '0.26s' }}
            aria-label="Follow Exotica PCMC on Instagram"
          >
            <i className="fab fa-instagram" aria-hidden="true" />
            Exotica &nbsp;·&nbsp; 1,659 followers
          </a>
        </div>

        {/* ── Stats strip ── */}
        <div className="exlife-stats reveal" style={{ transitionDelay: '0.3s' }}>
          <div className="exlife-stat-item">
            <span className="exlife-stat-num">98</span>
            <span className="exlife-stat-label">Posts</span>
          </div>
          <div className="exlife-stat-div" aria-hidden="true" />
          <div className="exlife-stat-item">
            <span className="exlife-stat-num">1.6K</span>
            <span className="exlife-stat-label">Followers</span>
          </div>
          <div className="exlife-stat-div" aria-hidden="true" />
          <div className="exlife-stat-item">
            <span className="exlife-stat-num">Daily</span>
            <span className="exlife-stat-label">Updates</span>
          </div>
        </div>

        {/* ── Real Instagram grid ── */}
        <div className="exlife-grid" role="list" aria-label="Exotica PCMC Instagram posts">
          {POSTS.map((post, i) => (
            <a
              key={post.id}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`exlife-card reveal exlife-span-${post.span ?? 'default'}`}
              style={{ transitionDelay: `${0.36 + i * 0.07}s` }}
              id={post.id}
              role="listitem"
              aria-label={`View ${post.alt} on Instagram`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.src}
                alt={post.alt}
                className="exlife-img"
                loading="lazy"
              />
              <div className="exlife-overlay" aria-hidden="true" />

              {/* Hover play icon */}
              <div className="exlife-hover-icon" aria-hidden="true">
                <i className="fab fa-instagram" />
              </div>

              <div className="exlife-card-foot">
                <span className="exlife-tag">{post.tag}</span>
                <span className="exlife-ig-icon">
                  <i className="fab fa-instagram" aria-hidden="true" />
                </span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
