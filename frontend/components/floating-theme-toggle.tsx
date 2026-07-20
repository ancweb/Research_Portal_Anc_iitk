'use client'

import { useColorTheme } from '@/components/theme-provider'

/**
 * Floating theme-toggle button — fixed to the bottom-right corner.
 * Shows the accent color of the OTHER theme as a preview swatch.
 */
export default function FloatingThemeToggle() {
  const { colorTheme, toggleColorTheme } = useColorTheme()

  const isRed = colorTheme === 'red'

  return (
    <button
      onClick={toggleColorTheme}
      aria-label={`Switch to ${isRed ? 'blue' : 'red'} theme`}
      title={`Switch to ${isRed ? 'blue' : 'red'} theme`}
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        px-4 py-2.5 rounded-full
        bg-white/90 backdrop-blur-sm
        border border-gold/30
        shadow-lg shadow-black/10
        text-xs font-semibold text-charcoal
        hover:shadow-xl hover:scale-105
        active:scale-95
        transition-all duration-200
      "
    >
      {/* Preview swatch — shows the colour you're switching TO */}
      <span
        className="w-4 h-4 rounded-full border border-black/10 shadow-inner shrink-0 transition-colors duration-300"
        style={{ backgroundColor: isRed ? '#1A3A6E' : '#6E1423' }}
      />
      {isRed ? 'Blue Theme' : 'Red Theme'}
    </button>
  )
}
