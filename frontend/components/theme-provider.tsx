'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ColorTheme = 'red' | 'blue'

interface ThemeContextValue {
  colorTheme: ColorTheme
  toggleColorTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  colorTheme: 'red',
  toggleColorTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>('red')

  // Sync class on <html> and persist preference
  useEffect(() => {
    const saved = localStorage.getItem('color-theme') as ColorTheme | null
    if (saved === 'blue' || saved === 'red') {
      setColorTheme(saved)
      document.documentElement.classList.toggle('theme-blue', saved === 'blue')
    }
  }, [])

  const toggleColorTheme = () => {
    setColorTheme((prev) => {
      const next: ColorTheme = prev === 'red' ? 'blue' : 'red'
      localStorage.setItem('color-theme', next)
      document.documentElement.classList.toggle('theme-blue', next === 'blue')
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ colorTheme, toggleColorTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useColorTheme() {
  return useContext(ThemeContext)
}
