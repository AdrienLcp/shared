'use client'

import React from 'react'

import Polyglot from './polyglot.js'

import { useProvidedContext } from '@/Helpers/contexts'
import type { DotNestedKeys } from '@/Helpers/strings'
import { useLocalStorage } from '@/Storage'

import frStrings from '@/I18n/Dictionaries/fr.json'
import enStrings from '@/I18n/Dictionaries/en.json'

type Dictionary = typeof enStrings

type I18NStringPaths = DotNestedKeys<Dictionary>

export const LOCALES = ['EN', 'FR'] as const

export type Locale = typeof LOCALES[number]

const DEFAULT_LOCALE: Locale = 'EN' as const

export const localesMap: LocalesMap = {
  FR: {
    label: 'Français',
    dictionary: frStrings
  },
  EN: {
    label: 'English',
    dictionary: enStrings
  }
}

type LocaleInfo = {
  label: string
  dictionary: Dictionary
}

type LocalesMap = Record<Locale, LocaleInfo>

type I18nContextValue = {
  currentLocale: Locale
  i18n: (key: I18NStringPaths, options?: Record<string, unknown>) => string
  changeLocale: (newLocale: Locale) => void
}

const isLocale = (locale: string): locale is Locale => {
  return Object.keys(localesMap).includes(locale)
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

export const I18nProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [currentLocale, setCurrentLocale] = useLocalStorage('locale', DEFAULT_LOCALE, isLocale)

  const currentDictionary = localesMap[currentLocale]?.dictionary

  const currentPolyglot = new Polyglot({
    phrases: currentDictionary as unknown as Record<string, string>
  })

  const changeLocale = (newLocale: Locale) => {
    if (isLocale(newLocale)) {
      setCurrentLocale(newLocale)
    }
  }

  React.useEffect(() => {
    const navigatorLanguage = navigator.language.slice(0, 2).toUpperCase()

    if (isLocale(navigatorLanguage)) {
      setCurrentLocale(navigatorLanguage)
    }
  }, [setCurrentLocale])

  const i18n = (key: I18NStringPaths, options?: Record<string, unknown>) => {
    return currentPolyglot.t(key, options)
  }

  return (
    <I18nContext.Provider value={{ currentLocale, i18n, changeLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useProvidedContext(I18nContext, 'I18n')
