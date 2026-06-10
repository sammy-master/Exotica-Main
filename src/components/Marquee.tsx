'use client'

const brands = [
  { name: 'Kinder',         cls: 'brand-kinder',    logo: '/logos/kinder.svg' },
  { name: 'KitKat',         cls: 'brand-kitkat',    logo: '/logos/kitkat.svg' },
  { name: 'Lindt',          cls: 'brand-lindt',     logo: '/logos/lindt.svg' },
  { name: 'Ferrero Rocher', cls: 'brand-ferrero',   logo: '/logos/ferrero.svg' },
  { name: 'Nestlé',         cls: 'brand-nestle',    logo: '/logos/nestle.svg' },
  { name: 'Nescafé',        cls: 'brand-nescafe',   logo: '/logos/nescafe.svg' },
  { name: 'Monster',        cls: 'brand-monster',   logo: '/logos/monster.svg' },
  { name: 'Red Bull',       cls: 'brand-redbull',   logo: '/logos/redbull.svg' },
  { name: 'Prime',          cls: 'brand-prime',     logo: '/logos/prime.svg' },
  { name: 'Toblerone',      cls: 'brand-toblerone', logo: '/logos/toblerone.svg' },
  { name: 'Haribo',         cls: 'brand-haribo',    logo: '/logos/haribo.svg' },
  { name: 'Pringles',       cls: 'brand-pringles',  logo: '/logos/pringles.svg' },
  { name: 'Lotus Biscoff',  cls: 'brand-biscoff',   logo: '/logos/biscoff.svg' },
  { name: 'Godiva',         cls: 'brand-godiva',    logo: '/logos/godiva.svg' },
  { name: 'Snickers',       cls: 'brand-snickers',  logo: '/logos/snickers.svg' },
  { name: 'Twix',           cls: 'brand-twix',      logo: '/logos/twix.svg' },
  { name: 'Skittles',       cls: 'brand-skittles',  logo: '/logos/skittles.svg' },
]

// Double for seamless loop
const doubled = [...brands, ...brands]

export default function Marquee() {
  return (
    <section className="marquee-section" aria-label="Brands we carry" id="brands">
      <div className="marquee-track-outer">
        <div className="marquee-track" aria-hidden="true">
          {doubled.map((brand, i) => (
            <div key={i} className="marquee-item">
              <div className="marquee-brand-group">
                <img 
                  src={`${brand.logo}?v=2`} 
                  alt={`${brand.name} logo`} 
                  className="marquee-brand-logo"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className={`marquee-brand-name ${brand.cls}`}>
                  {brand.name}
                </span>
              </div>
              <span className="marquee-sep" aria-hidden="true">◆</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
