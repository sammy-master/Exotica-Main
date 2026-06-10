'use client'

import { useEffect, useRef } from 'react'

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loader = loaderRef.current
    if (!loader) return
    document.body.classList.add('loading')
    const t = setTimeout(() => {
      loader.classList.add('hide')
      document.body.classList.remove('loading')
    }, 2600)
    return () => clearTimeout(t)
  }, [])

  const letters = 'EXOTICA'.split('')

  return (
    <div className="loader" ref={loaderRef} id="loader" aria-label="Loading Exotica">
      <div className="loader-logo" aria-hidden="true">
        {letters.map((l, i) => (
          <span key={i} className="loader-logo-letter">{l}</span>
        ))}
      </div>
      <div className="loader-bar-wrap">
        <div className="loader-bar" />
      </div>
      <p className="loader-sub">Premium Imported Goods · PCMC, Pune</p>
    </div>
  )
}
