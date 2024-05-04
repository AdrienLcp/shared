import type { Locale } from '@/I18n'
import type { Theme } from '@/Theme'

type LocalStorage = {
  theme: Theme
  locale: Locale
}

type LocaleStorageKey = keyof LocalStorage

export const getStoredItem = <K extends LocaleStorageKey> (key: K): LocalStorage[K] | undefined => {
  const value = window.localStorage.getItem(key)

  if (value !== null) {
    try {
      return value === 'undefined' ? undefined : JSON.parse(value ?? '')
    } catch {
      console.warn(`Parsing error for key "${key}"`)
      return undefined
    }
  }
}

export const storeItem = <K extends LocaleStorageKey> (key: K, value: LocalStorage[K]) => {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeStoredItem = (key: LocaleStorageKey) => {
  window.localStorage.removeItem(key)
}

export const clearStore = () => {
  window.localStorage.clear()
}