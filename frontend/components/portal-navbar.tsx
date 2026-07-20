'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useColorTheme } from '@/components/theme-provider'

interface PortalNavbarProps {
  /** Label shown next to the logo wordmark, e.g. "Research Portal" */
  title?: string
  /** Where the "← Back" link should go */
  backHref?: string
  /** Label for the back link */
  backLabel?: string
  /** Optional extra slot rendered on the right side of the bar */
  actions?: React.ReactNode
}

/**
 * Sticky top navbar shared by all portal / sub-route pages.
 * Matches the cream / maroon / gold brand of the main website.
 */
export default function PortalNavbar({
  title = 'Research Portal',
  backHref = '/',
  backLabel = 'Back to Home',
  actions,
}: PortalNavbarProps) {
  const { colorTheme } = useColorTheme()
  const logoSrc = colorTheme === 'blue' ? '/logo-blue.png' : '/logo-red.png'

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-cream/95 border-b border-gold/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src={logoSrc}
            alt="Research Wing, IIT Kanpur logo"
            width={48}
            height={48}
            className="shrink-0 transition-opacity duration-300"
          />
          <div className="hidden sm:block leading-tight">
            <span className="font-serif text-lg font-bold text-maroon block">{title}</span>
            <span className="text-[10px] font-sans font-normal tracking-widest text-gold uppercase">
              IIT Kanpur
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {actions}
          <Link
            href={backHref}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 text-charcoal text-sm font-medium hover:bg-gold/10 hover:border-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{backLabel}</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
