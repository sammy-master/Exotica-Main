import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'

export const viewport: Viewport = {
  themeColor: '#050505',
}

export const metadata: Metadata = {
  title: 'Exotica PCMC — Premium Imported Chocolates, Drinks & Global Treats',
  description: "Exotica PCMC — Pune's premier luxury destination for imported chocolates, exotic snacks, premium beverages & global gourmet treats. 100+ international brands. Visit our store in Pimpri-Chinchwad.",
  keywords: 'imported chocolates Pune, exotic snacks PCMC, premium beverages Pimpri Chinchwad, Ferrero Rocher Pune, Lindt chocolates, Monster energy drink, Red Bull, Kinder Joy, Godiva chocolate, gourmet food shop',
  openGraph: {
    title: 'Exotica PCMC — Premium Imported Goods',
    description: 'Discover imported chocolates, premium drinks & global treats. 100+ brands. PCMC, Pune.',
    type: 'website',
  },
}

import ScrollPath from '@/components/ScrollPath'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body>
        <ScrollPath />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}
