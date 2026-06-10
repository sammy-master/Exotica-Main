'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'

const navLinks = [
  { href: '#hero',      label: 'Home'       },
  { href: '#products',  label: 'Shop'       },
  { href: '#contact',   label: 'Contact'    },
]

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [badgePop,  setBadgePop]  = useState(false)
  const { totalItems, toggleCart, openCart } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Badge pop animation on item add
  useEffect(() => {
    if (totalItems === 0) return
    setBadgePop(true)
    const t = setTimeout(() => setBadgePop(false), 400)
    return () => clearTimeout(t)
  }, [totalItems])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <a href="#hero" className="nav-logo-wrap" aria-label="Exotica PCMC — Home">
            <span className="nav-logo-brand">EXOTICA</span>
            <span className="nav-logo-sub">PCMC · Pune</span>
          </a>

          <ul className="nav-links" role="list">
            {navLinks.map((l, i) => (
              <li key={i}>
                <a href={l.href} className="nav-link" id={`nav-link-${l.label.toLowerCase()}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className="nav-cart-btn"
            onClick={toggleCart}
            id="nav-cart-btn"
            aria-label={`Cart — ${totalItems} items`}
          >
            <i className="fas fa-shopping-bag" aria-hidden="true" />
            <span>Cart</span>
            {totalItems > 0 && (
              <span className={`cart-badge${badgePop ? ' pop' : ''}`} aria-live="polite">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            id="hamburger-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <div className={`mobile-nav${menuOpen ? ' open' : ''}`} role="dialog" aria-label="Mobile navigation" aria-modal="true">
        <div className="mobile-nav-inner">
          {navLinks.map((l, i) => (
            <a
              key={i}
              href={l.href}
              className="mobile-nav-link"
              onClick={closeMenu}
              id={`mobile-nav-${l.label.toLowerCase()}`}
              style={{ transitionDelay: `${i * 0.06}s` }}
            >
              {l.label}
            </a>
          ))}
          <button
            className="mobile-nav-link"
            onClick={() => { closeMenu(); openCart() }}
            style={{ transitionDelay: '0.3s', background: 'none', border: 'none', fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)', cursor: 'none', letterSpacing: '0.08em' }}
          >
            Cart ({totalItems})
          </button>
        </div>
      </div>
    </>
  )
}
