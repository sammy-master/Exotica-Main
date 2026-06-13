'use client'

import { useEffect, useState, useRef } from 'react'

export default function ScrollPath() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const pathRef1 = useRef<SVGPathElement>(null)
  const pathRef2 = useRef<SVGPathElement>(null)
  const [lengths, setLengths] = useState({ len1: 0, len2: 0 })

  useEffect(() => {
    // Initial measure
    if (pathRef1.current && pathRef2.current) {
      setLengths({
        len1: pathRef1.current.getTotalLength(),
        len2: pathRef2.current.getTotalLength()
      })
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      // Use requestAnimationFrame for buttery smooth progress updates
      window.requestAnimationFrame(() => {
        const progress = Math.min(Math.max(window.scrollY / scrollHeight, 0), 1)
        setScrollProgress(progress)
      })
    }

    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (pathRef1.current && pathRef2.current) {
          setLengths({
            len1: pathRef1.current.getTotalLength(),
            len2: pathRef2.current.getTotalLength()
          })
        }
        handleScroll()
      }, 200) // Debounce to prevent jitter on mobile when URL bar hides
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    
    const timer = setTimeout(handleScroll, 150)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(timer)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Refined paths: Kept strictly on the left side (0% to 20% width) 
  // so it never overlaps or interferes with reading text on narrow mobile screens.
  const path1 = "M 5,0 C 15,20 20,35 8,55 C 2,75 12,90 5,100"
  const path2 = "M 10,0 C 0,25 5,45 18,65 C 25,85 2,95 10,100"

  return (
    <div
      className="scroll-path-container"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        opacity: 0.85 // Increased overall visibility
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main bright gold gradient */}
          <linearGradient id="gold-bright" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d4a843" stopOpacity="0" />
            <stop offset="20%" stopColor="#d4a843" stopOpacity="1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="80%" stopColor="#d4a843" stopOpacity="1" />
            <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
          </linearGradient>

          {/* Deep gold/bronze for the secondary ribbon */}
          <linearGradient id="gold-deep" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a37c27" stopOpacity="0" />
            <stop offset="25%" stopColor="#d4a843" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#d4a843" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a37c27" stopOpacity="0" />
          </linearGradient>

          {/* Enhanced Glow filter */}
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* ─── Background Faint Tracks ─── */}
        <path d={path1} fill="none" stroke="rgba(212, 168, 67, 0.15)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        <path d={path2} fill="none" stroke="rgba(212, 168, 67, 0.1)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />

        {/* ─── Active Drawn Paths ─── */}
        {/* Secondary Ribbon (Deep Gold) */}
        <path
          ref={pathRef2}
          d={path2}
          fill="none"
          stroke="url(#gold-deep)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          filter="url(#glow-strong)"
          style={{
            strokeDasharray: lengths.len2,
            strokeDashoffset: lengths.len2 - lengths.len2 * scrollProgress,
            transition: 'stroke-dashoffset 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'stroke-dashoffset'
          }}
        />

        {/* Primary Ribbon (Bright Gold) */}
        <path
          ref={pathRef1}
          d={path1}
          fill="none"
          stroke="url(#gold-bright)"
          strokeWidth="3.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          filter="url(#glow-strong)"
          style={{
            strokeDasharray: lengths.len1,
            strokeDashoffset: lengths.len1 - lengths.len1 * scrollProgress,
            transition: 'stroke-dashoffset 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'stroke-dashoffset'
          }}
        />
      </svg>
    </div>
  )
}
