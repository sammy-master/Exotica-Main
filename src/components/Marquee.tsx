'use client'

/**
 * Brand marquee — single scrolling row with all brand logos.
 * Logos are in /public/logos/*.svg
 * The track is doubled for seamless infinite scroll.
 *
 * iOS Safari fix notes:
 *  - Images use loading="eager" to prevent lazy-load causing disappear on scroll
 *  - draggable="false" prevents iOS treating logos as draggable elements
 *  - The CSS uses translateZ(0) + will-change for GPU compositing
 *  - @-webkit-keyframes added for full Safari compat
 */

const brands = [
  { name: 'Monster',    logo: '/logos/monster.svg',   className: 'brand-monster',  hideText: true },
  { name: 'Red Bull',   search: 'RedBull', logo: '/logos/redbull.svg',   className: 'brand-redbull',  hideText: true },
  { name: 'Coca-Cola',  logo: '/logos/cocacola.svg',  className: 'brand-cocacola', hideText: true },
  { name: 'Pepsi',      logo: '/logos/pepsi.png?v=3', className: 'brand-pepsi',    hideText: true },
  { name: 'Fanta',      logo: '/logos/fanta.png?v=3', className: 'brand-fanta',    hideText: true },
  { name: 'Prime',      logo: '/logos/prime.png',     className: 'brand-prime',    hideText: true },
  { name: 'Nescafé',    search: 'Nescafe', logo: '/logos/nescafe.png',   className: 'brand-nescafe',  hideText: true },
  { name: 'Lindt',      logo: '/logos/lindt.png',     className: 'brand-lindt',    hideText: true },
  { name: 'Starbucks',  logo: '/logos/starbucks.png?v=3', className: 'brand-starbucks', hideText: true },
  { name: 'Mirinda',    logo: '/logos/mirinda.png',   className: 'brand-mirinda',  hideText: true },
  { name: 'Dr Pepper',  logo: '/logos/drpepper.png',  className: 'brand-drpepper', hideText: true },
  { name: 'Kinza',      logo: '/logos/kinza.png',     className: 'brand-kinza',    hideText: true },
  { name: 'Vinut',      logo: '/logos/vinut.png',     className: 'brand-vinut',    hideText: true },
  { name: 'Rani Float', logo: '/logos/rani.png?v=3',  className: 'brand-rani',     hideText: true },
]

// Double for seamless loop (CSS keyframe scrolls exactly -50%)
const doubled = [...brands, ...brands]

export default function Marquee() {
  const handleBrandClick = (brandSearch: string) => {
    window.dispatchEvent(new CustomEvent('filterBrand', { detail: brandSearch }))
  }

  return (
    <section className="marquee-section" aria-label="Brands we carry" id="brands">
      <div className="marquee-track-outer">
        <div className="marquee-track" aria-hidden="true">
          {doubled.map((brand, i) => (
            <button
              key={i}
              className="marquee-item"
              title={`View ${brand.name} products`}
              onClick={() => handleBrandClick(brand.search || brand.name)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              aria-label={`View ${brand.name} products`}
            >
              <div className="marquee-brand-group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className={`marquee-brand-logo ${brand.className}`}
                  loading="eager"
                  draggable={false}
                />
                {!brand.hideText && (
                  <span className={`marquee-brand-name ${brand.className}`}>{brand.name}</span>
                )}
              </div>
              <span className="marquee-sep" aria-hidden="true">◆</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
