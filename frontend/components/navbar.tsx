'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NAVIGATION } from '@/lib/constants'
import { useColorTheme } from '@/components/theme-provider'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { colorTheme } = useColorTheme()

  const logoSrc = colorTheme === 'blue' ? '/logo-blue.png' : '/logo-red.png'

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/90 border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logoSrc}
            alt="Research Wing, IIT Kanpur logo"
            width={64}
            height={64}
            className="shrink-0 transition-opacity duration-300"
          />
          <span className="font-serif text-xl md:text-2xl font-bold text-maroon leading-tight">
            Research Wing
            <span className="block text-xs font-sans font-normal tracking-widest text-gold uppercase">
              IIT Kanpur
            </span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm text-charcoal hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <Link
          href="/research-portal"
          className="hidden md:inline-block px-6 py-2 rounded-full bg-gold text-charcoal font-semibold text-sm hover:bg-gold/90 transition-colors"
        >
          Research Portal
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-maroon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gold/20 bg-cream px-6 py-4 flex flex-col gap-3">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-charcoal hover:text-gold transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/research-portal"
            onClick={() => setMobileOpen(false)}
            className="mt-2 px-6 py-2 rounded-full bg-gold text-charcoal font-semibold text-sm text-center hover:bg-gold/90 transition-colors"
          >
            Research Portal
          </Link>
        </div>
      )}
    </nav>
  )
}
