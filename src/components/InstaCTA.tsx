export default function InstaCTA() {
  return (
    <section className="insta-cta" id="insta-cta">
      <div className="insta-glow" />
      <div style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
        <div id="insta-content">
          <div className="insta-icon">
            <i className="fab fa-instagram" />
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>
            Follow Our <em style={{ fontStyle: 'italic', background: 'var(--gold-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Daily Drops</em>
          </h2>
          <p style={{ color: 'rgba(240,236,228,0.65)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.8 }}>
            New viral products added every day. Be the first to know — follow us on Instagram for daily updates, unboxings, and exclusive deals.
          </p>
          <a
            href="https://www.instagram.com/exotica.pcmc/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold-full"
            id="insta-follow-btn"
          >
            <i className="fab fa-instagram" /> Exotica.pcmc
          </a>
        </div>
      </div>
    </section>
  )
}
