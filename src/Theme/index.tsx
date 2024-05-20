import React from 'react'

import { useProvidedContext } from '@/Helpers/contexts'
import { useLocalStorage } from '@/Storage'

export const THEMES = ['System', 'Light', 'Dark'] as const
export type Theme = typeof THEMES[number]

const PREFERS_DARK_COLOR_SCHEME = '(prefers-color-scheme: dark)'

type ThemeContextValue = {
  isDarkModeActive: boolean
  currentTheme: Theme
  changeTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isDarkModeActive, setIsDarkModeActive] = React.useState<boolean>(true)
  const [currentTheme, setCurrentTheme] = useLocalStorage('theme', 'System')

  const changeTheme = (theme: Theme) => {
    if (!THEMES.includes(theme)) {
      return
    }

    setCurrentTheme(theme)

    if (theme === 'System') {
      const matcher = window.matchMedia(PREFERS_DARK_COLOR_SCHEME)
      setIsDarkModeActive(matcher.matches)
      return
    }

    setIsDarkModeActive(theme === 'Dark')
  }

  React.useEffect(() => {
    const handlePrefersColorSchemeChange = (event: MediaQueryListEvent) => {
      if (currentTheme === 'System') {
        setIsDarkModeActive(event.matches)
      }
    }

    const matcher = window.matchMedia(PREFERS_DARK_COLOR_SCHEME)

    if (currentTheme === 'System') {
      setIsDarkModeActive(matcher.matches)
      matcher.addEventListener('change', handlePrefersColorSchemeChange)
    } else {
      matcher.removeEventListener('change', handlePrefersColorSchemeChange)
    }

    return () => {
      matcher.removeEventListener('change', handlePrefersColorSchemeChange)
    }
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ isDarkModeActive, currentTheme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useProvidedContext(ThemeContext, 'Theme')
