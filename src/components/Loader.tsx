'use client'

import { useEffect, useRef, useState } from 'react'

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const [showLoader, setShowLoader] = useState(false)

  // Only run the loader if it hasn't been shown in this session
  useEffect(() => {
    if (!sessionStorage.getItem('exotica_loaded')) {
      setShowLoader(true)
      sessionStorage.setItem('exotica_loaded', 'true')
    }
  }, [])

  useEffect(() => {
    if (!showLoader) return
    
    const loader = loaderRef.current
    if (!loader) return
    
    document.body.classList.add('loading')
    const t = setTimeout(() => {
      loader.classList.add('hide')
      document.body.classList.remove('loading')
    }, 2600)
    return () => clearTimeout(t)
  }, [showLoader])

  if (!showLoader) return null

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
