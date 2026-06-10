import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'teal-brand': {
          1: '#006466',
          2: '#065a60',
          3: '#0b525b',
        },
        'navy': {
          1: '#144552',
          2: '#1b3a4b',
          3: '#212f45',
        },
        'indigo-brand': '#272640',
        'purple-brand': {
          1: '#312244',
          2: '#3e1f47',
          3: '#4d194d',
        },
        'gold': {
          bright: '#f5c842',
          mid: '#d4a017',
          deep: '#b8860b',
        },
        'bg': {
          darkest: '#0a0a14',
          dark: '#0f0f1e',
          surface: '#141428',
        },
        'text': {
          primary: '#f0ece4',
          secondary: 'rgba(240,236,228,0.65)',
          muted: 'rgba(240,236,228,0.38)',
        },
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5c842 0%, #d4a017 40%, #f5c842 70%, #b8860b 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0a0a14 0%, #1b1b30 40%, #2a1a3e 70%, #1a0e2a 100%)',
        'marquee-gradient': 'linear-gradient(135deg, #065a60, #312244)',
        'insta-gradient': 'linear-gradient(135deg, #1a0b2e, #2a1040, #0d2040)',
        'ig-icon-gradient': 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
      },
      boxShadow: {
        'gold': '0 0 40px rgba(245,200,66,0.12), 0 20px 60px rgba(0,0,0,0.6)',
        'card': '0 8px 40px rgba(0,0,0,0.5)',
        'btn': '0 4px 20px rgba(245,200,66,0.3)',
        'btn-hover': '0 8px 35px rgba(245,200,66,0.45)',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'float': 'floatCard 4s ease-in-out infinite',
        'float-delay-1': 'floatCard 4s ease-in-out infinite -1.5s',
        'float-delay-2': 'floatCard 4s ease-in-out infinite -3s',
        'orb-float': 'orbFloat 8s ease-in-out infinite',
        'pulse-dot': 'pulse 2s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'icon-pulse': 'iconPulse 2s ease-in-out infinite',
        'logo-shimmer': 'logoShimmer 4s ease-in-out infinite',
        'letter-drop': 'letterDrop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'grow-line': 'growLine 0.8s 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.5s 1s ease forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        'slide-right': 'slideRight 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        orbFloat: {
          '0%, 100%': { transform: 'scale(1) translateY(0)' },
          '33%': { transform: 'scale(1.05) translateY(-20px)' },
          '66%': { transform: 'scale(0.97) translateY(10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        iconPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        logoShimmer: {
          '0%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 8px rgba(245,200,66,0.3))' },
          '100%': { filter: 'brightness(1)' },
        },
        letterDrop: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        growLine: {
          to: { width: '200px' },
        },
        fadeIn: {
          to: { opacity: '1' },
        },
        slideUp: {
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
