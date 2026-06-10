'use client'

import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const mouse   = useRef({ x: 0, y: 0 })
  const ring    = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dot = dotRef.current
    const rng = ringRef.current
    if (!dot || !rng) return

    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
    }

    let rafId: number
    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1
      rng.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animateRing)
    }
    animateRing()

    document.addEventListener('mousemove', onMove, { passive: true })

    const addHover    = () => { dot.classList.add('hover');    rng.classList.add('hover') }
    const removeHover = () => { dot.classList.remove('hover'); rng.classList.remove('hover') }
    const addClick    = () => rng.classList.add('click')
    const removeClick = () => rng.classList.remove('click')

    const bindHover = () => {
      document.querySelectorAll<HTMLElement>('a, button, [role="button"], .product-card, .why-card, .world-country-card').forEach(el => {
        el.addEventListener('mouseenter', addHover)
        el.addEventListener('mouseleave', removeHover)
      })
    }

    bindHover()
    // Rebind after any DOM mutation (e.g. cart opens)
    const observer = new MutationObserver(bindHover)
    observer.observe(document.body, { subtree: true, childList: true })

    document.addEventListener('mousedown', addClick)
    document.addEventListener('mouseup', removeClick)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      document.removeEventListener('mousedown', addClick)
      document.removeEventListener('mouseup', removeClick)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"  ref={dotRef}  aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  )
}
