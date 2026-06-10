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
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
    if (trackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
      setCanScrollLeft(Math.ceil(scrollLeft) > 5)
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 5)
      
      const scrollAmt = 400
      setActiveIndex(Math.round(scrollLeft / scrollAmt))
    }
  }

  useEffect(() => {
    handleScroll()
    window.addEventListener('resize', handleScroll)
    return () => window.removeEventListener('resize', handleScroll)
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmt = 400
      trackRef.current.scrollBy({ left: dir === 'left' ? -scrollAmt : scrollAmt, behavior: 'smooth' })
    }
  }

  const scrollTo = (index: number) => {
    if (trackRef.current) {
      const scrollAmt = 400
      trackRef.current.scrollTo({ left: index * scrollAmt, behavior: 'smooth' })
    }
  }
  return (
    <section className="testimonials-section" id="testimonials" aria-label="Customer reviews">
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ maxWidth: 600, marginBottom: 16 }}>
          <div className="section-label">
            <span className="gold-line" aria-hidden="true" />
            Customer Love
          </div>
          <h2 className="section-title">
            What Our Customers<br />
            <em>Are Saying</em>
          </h2>
        </div>

        <div className="testimonials-track-outer" aria-label="Scrolling customer reviews">
        <button className={`review-nav-btn prev ${!canScrollLeft ? 'hidden' : ''}`} onClick={() => scroll('left')} aria-label="Previous review">
          <i className="fas fa-chevron-left" aria-hidden="true" />
        </button>
        <button className={`review-nav-btn next ${!canScrollRight ? 'hidden' : ''}`} onClick={() => scroll('right')} aria-label="Next review">
          <i className="fas fa-chevron-right" aria-hidden="true" />
        </button>

        <div className="testimonials-track-mask">
          <div className="testimonials-track" role="list" ref={trackRef} onScroll={handleScroll}>
            {reviews.map((r, i) => (
            <div key={i} className="testimonial-card" role="listitem">
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

        {/* Dot Pagination */}
        <div className="testimonials-dots">
          {reviews.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => scrollTo(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
