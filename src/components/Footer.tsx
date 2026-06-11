const navLinks = [
  { href: '#hero',      label: 'Home'      },
  { href: '#products',  label: 'Shop'      },
  { href: '#why',       label: 'About'     },
  { href: '#world',     label: 'Our World' },
  { href: '#contact',   label: 'Contact'   },
]

const collections = [
  { href: '#products', label: 'Chocolates' },
  { href: '#products', label: 'Drinks'     },
  { href: '#products', label: 'Snacks'     },
  { href: '#products', label: 'Candy'      },
  { href: '#products', label: 'Biscuits'   },
  { href: '#products', label: 'Limited Ed' },
]

export default function Footer() {
  return (
    <footer className="footer" id="footer" role="contentinfo">
      <div className="footer-glow" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-top">

          {/* ── Brand ── */}
          <div className="footer-brand">
            <span className="footer-brand-name">EXOTICA</span>
            <span className="footer-brand-sub">PCMC · Pune, India</span>
            <p className="footer-brand-desc">
              Pune&apos;s premier destination for premium imported chocolates, exotic beverages &amp; global gourmet treats from around the world.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/exotica.pcmc/" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-ig" aria-label="Follow on Instagram">
                <i className="fab fa-instagram" aria-hidden="true" />
              </a>
              <a href="https://wa.me/919296909095" target="_blank" rel="noopener noreferrer" className="footer-social-link" id="footer-wa" aria-label="Chat on WhatsApp">
                <i className="fab fa-whatsapp" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* ── Columns wrapper for 2-col on mobile ── */}
          <div className="footer-cols-grid">

            {/* Navigate */}
            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                {navLinks.map(l => (
                  <li key={l.href + l.label}>
                    <a href={l.href} id={`footer-nav-${l.label.toLowerCase().replace(' ', '-')}`}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collections */}
            <div className="footer-col">
              <h4>Collections</h4>
              <ul>
                {collections.map(l => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visit Us */}
            <div className="footer-col footer-col-visit">
              <h4>Visit Us</h4>
              <ul>
                <li><a href="https://wa.me/919296909095" target="_blank" rel="noopener noreferrer" id="footer-order">Order on WhatsApp</a></li>
                <li><a href="https://www.instagram.com/exotica.pcmc/" target="_blank" rel="noopener noreferrer" id="footer-dm">DM on Instagram</a></li>
                <li><a href="https://maps.google.com/?q=Shakuntal+Commercia+Dehu+Alandi+Pune" target="_blank" rel="noopener noreferrer" id="footer-dir">Get Directions</a></li>
                <li><a href="tel:+919296909095" id="footer-call">+91 92969 09095</a></li>
                <li className="footer-hours">Mon – Sun: 10AM – 9PM</li>
              </ul>
            </div>

          </div>{/* end footer-cols-grid */}

        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Exotica PCMC. All rights reserved.</p>
          <p style={{ fontSize: '0.65rem', color: 'var(--text-faint)', letterSpacing: '0.12em' }}>
            B-24, Shakuntal Commercia · Dehu-Alandi Road · Pimpri-Chinchwad, Pune 411062
          </p>
        </div>
      </div>
    </footer>
  )
}
