import React from 'react'

import type { Locale } from '@/I18n'
import type { Theme } from '@/Theme'

type LocalStorage = {
  theme: Theme
  locale: Locale
}

type LocaleStorageKey = keyof LocalStorage

const warn = (message: string) => {
  console.log('Window is not defined', message)
}

export const getStoredItem = <K extends LocaleStorageKey> (key: K): LocalStorage[K] | undefined => {
  if (window === undefined) {
    warn(` - Trying to get key : ${key}`)
    return undefined
  }

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
  if (window === undefined) {
    warn(` - Trying to store key : ${key} with value : ${value}`)
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeStoredItem = (key: LocaleStorageKey) => {
  if (window === undefined) {
    warn(` - Trying to remove key : ${key}`)
    return
  }

  window.localStorage.removeItem(key)
}

export const clearStore = () => {
  if (window === undefined) {
    warn(' - Trying to clear store')
    return
  }

  window.localStorage.clear()
}

export const useLocalStorage = <K extends LocaleStorageKey> (
  key: K,
  initialValue: LocalStorage[K],
  isValidValue?: (value: LocalStorage[K]) => value is LocalStorage[K]
): [LocalStorage[K], React.Dispatch<React.SetStateAction<LocalStorage[K]>>] => {
  const [value, setValue] = React.useState<LocalStorage[K]>(initialValue)

  const storeValidItem = React.useCallback((newValue: LocalStorage[K]) => {
    if (isValidValue === undefined) {
      storeItem(key, newValue)
      return
    }

    if (isValidValue(newValue)) {
      storeItem(key, newValue)
    }
  }, [isValidValue, key])

  React.useEffect(() => {
    storeValidItem(value)
  }, [storeValidItem, value])

  React.useEffect(() => {
    const storedValue = getStoredItem(key)

    if (storedValue !== undefined) {
      storeValidItem(storedValue)
    }
  }, [key, storeValidItem])

  return [value, setValue]
}
