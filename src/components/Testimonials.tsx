'use client'
import { useRef, useState, useEffect } from 'react'

const reviews = [
  { name: 'Priya Sharma',   loc: 'Pimpri',    text: 'Exotica is my go-to for imported chocolates! The Lindt and Ferrero selection is unmatched in PCMC. Always fresh, always premium.', rating: 5, init: 'P' },
  { name: 'Rohan Mehta',    loc: 'Chinchwad',  text: 'Found Prime Hydration here before anywhere else in Pune! The store has an incredible collection of viral products. Highly recommend.', rating: 5, init: 'R' },
  { name: 'Ananya Kulkarni',loc: 'Akurdi',     text: 'Gorgeous store, super friendly staff. Got KitKat Matcha from Japan — it\'s exactly what I\'d been searching for. Will be back!', rating: 5, init: 'A' },
  { name: 'Dev Patel',      loc: 'Nigdi',      text: 'Monster Energy at the best price in the area. The variety of energy drinks is massive. My weekly stop for sure.', rating: 5, init: 'D' },
  { name: 'Sneha Joshi',    loc: 'Wakad',      text: 'The Godiva gift box I bought for my anniversary was stunning. Worth every rupee. Beautifully packaged and so delicious.', rating: 5, init: 'S' },
  { name: 'Arjun Singh',    loc: 'Bhosari',    text: 'Best imported goods store I\'ve found in the whole Pune-PCMC area. Toblerone, Haribo, Pringles — everything is here!', rating: 5, init: 'A' },
  { name: 'Meena Desai',    loc: 'Ravet',      text: 'WhatsApp ordering is so convenient! I just send them my list and they confirm availability instantly. Great service.', rating: 5, init: 'M' },
  { name: 'Karan Verma',    loc: 'Hinjewadi',  text: 'Lotus Biscoff spread AND the original biscuits — both in stock! Exotica never disappoints. Prices are fair for imported goods.', rating: 5, init: 'K' },
]

export default function Testimonials() {
  const row1 = [...reviews, ...reviews]
  const row2 = [...[...reviews].reverse(), ...[...reviews].reverse()]

  return (
    <section className="testimonials-section" id="testimonials" aria-label="Customer reviews">
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ maxWidth: 600, marginBottom: 40 }}>
          <div className="section-label">
            <span className="gold-line" aria-hidden="true" />
            Customer Love
          </div>
          <h2 className="section-title">
            What Our Customers<br />
            <em>Are Saying</em>
          </h2>
        </div>
      </div>

      <div className="testimonials-marquee-container">
        <div className="testimonials-marquee-track">
          {row1.map((r, i) => (
            <div key={`row1-${i}`} className="testimonial-card">
              <div className="testimonial-stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <span key={j} className="testimonial-star" aria-hidden="true">★</span>
                ))}
              </div>
              <p className="testimonial-text">&ldquo;{r.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" aria-hidden="true">{r.init}</div>
                <div>
                  <p className="testimonial-name">{r.name}</p>
                  <p className="testimonial-loc">{r.loc}, Pune</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-marquee-container" style={{ marginTop: '20px' }}>
        <div className="testimonials-marquee-track reverse">
          {row2.map((r, i) => (
            <div key={`row2-${i}`} className="testimonial-card">
              <div className="testimonial-stars" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }).map((_, j) => (
                  <span key={j} className="testimonial-star" aria-hidden="true">★</span>
                ))}
              </div>
              <p className="testimonial-text">&ldquo;{r.text}&rdquo;</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar" aria-hidden="true">{r.init}</div>
                <div>
                  <p className="testimonial-name">{r.name}</p>
                  <p className="testimonial-loc">{r.loc}, Pune</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
