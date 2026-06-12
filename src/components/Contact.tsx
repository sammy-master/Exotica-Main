'use client'

import { useEffect, useRef } from 'react'

const WA_NUMBER = '919296909095'
const IG_URL    = 'https://www.instagram.com/exotica.pcmc/'
const MAPS_URL  = 'https://maps.google.com/?q=B-24+Shakuntal+Commercia+Dehu+Alandi+Road+Pimpri+Chinchwad+Pune'
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3779.6133815421317!2d73.82622427582336!3d18.681337364242417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b7fe03b369d3%3A0x691a5b80b3c1e2fc!2sShakuntal%20Commercia!5e0!3m2!1sen!2sin!4v1780931483109!5m2!1sen!2sin'

const contactItems = [
  {
    id: 'contact-addr',
    icon: 'fas fa-map-marker-alt',
    title: 'Store Address',
    body: 'B-24, Shakuntal Commercia\nDehu-Alandi Road\nPimpri-Chinchwad, Pune\nMaharashtra – 411062',
    href: MAPS_URL,
  },
  {
    id: 'contact-phone',
    icon: 'fab fa-whatsapp',
    title: 'WhatsApp / Call',
    body: '+91 92969 09095\n+91 92969 09094',
    href: `https://wa.me/${WA_NUMBER}`,
  },
  {
    id: 'contact-ig',
    icon: 'fab fa-instagram',
    title: 'Instagram',
    body: '@exotica.pcmc',
    href: IG_URL,
  },
  {
    id: 'contact-hours',
    icon: 'fas fa-clock',
    title: 'Store Hours',
    body: 'Monday – Sunday\n10:00 AM – 9:00 PM',
    href: null,
  },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    el.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="contact-section" id="contact" ref={sectionRef} aria-label="Contact and location">
      <div className="contact-inner">
        <div style={{ maxWidth: 600, marginBottom: 16 }}>
          <div className="section-label reveal">
            <span className="gold-line" aria-hidden="true" />
            Find Us
          </div>
          <h2 className="section-title reveal reveal-delay-1">
            Visit <em>Exotica PCMC</em>
          </h2>
          <p className="reveal reveal-delay-2" style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.9, marginTop: 16 }}>
            Step into our store and experience the world without leaving Pune. Browse hundreds of imported products in person and discover your new favourites.
          </p>
        </div>

        <div className="contact-grid">
          {/* Info Cards */}
          <div className="contact-info reveal-left">
            {contactItems.map(item => (
              <div key={item.id} className="contact-item" id={item.id}>
                <div className="contact-icon-wrap">
                  <i className={item.icon} aria-hidden="true" />
                </div>
                <div>
                  <p className="contact-item-title">{item.title}</p>
                  <div className="contact-item-body">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.body.split('\n').map((line, i) => (
                          <span key={i} style={{ display: 'block' }}>{line}</span>
                        ))}
                      </a>
                    ) : (
                      item.body.split('\n').map((line, i) => (
                        <span key={i} style={{ display: 'block' }}>{line}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="contact-cta-row" style={{ marginTop: 8 }}>
              <a
                href={`https://wa.me/${WA_NUMBER}?text=Hello%20Exotica!%20I%20would%20like%20to%20know%20more%20about%20your%20products.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
                id="contact-wa-btn"
              >
                <i className="fab fa-whatsapp" aria-hidden="true" />
                Chat on WhatsApp
              </a>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                id="contact-dir-btn"
              >
                <i className="fas fa-directions" aria-hidden="true" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="map-wrap reveal-right">
            <iframe
              id="google-map-iframe"
              title="Exotica PCMC Location — Shakuntal Commercia, Dehu-Alandi Road"
              src={MAPS_EMBED}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ 
                border: 0,
                filter: 'grayscale(0.8) invert(0.95) hue-rotate(180deg) sepia(0.1) contrast(1.1)'
              }}
              allowFullScreen
            />
            <div className="map-label">
              <span className="map-label-text">
                <i className="fas fa-map-marker-alt" aria-hidden="true" style={{ color: '#E53935', marginRight: 8, fontSize: '1.1em' }} />
                Shakuntal Commercia, Dehu-Alandi Road
              </span>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="map-open-link" id="open-maps-btn">
                Open in Maps <i className="fas fa-external-link-alt" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
