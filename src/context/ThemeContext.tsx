'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  // On mount, read from localStorage / system preference
  useEffect(() => {
    const saved = localStorage.getItem('exotica-theme') as Theme | null
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    } else {
      // Respect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    setMounted(true)
  }, [])

  // Apply theme attribute to <html>
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    localStorage.setItem('exotica-theme', theme)
  }, [theme, mounted])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  // Prevent flash of wrong theme by hiding until mounted
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <style>{`html:not([data-theme]) { opacity: 0; }`}</style>
      {children}
    </ThemeContext.Provider>
  )
}
