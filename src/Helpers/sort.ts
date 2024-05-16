export type SortType = 'asc' | 'desc' | 'none'

const getSortedValues = <T> (a: T, b: T, sortDirection: Omit<SortType, 'none'>): number => {
  const [valueA, valueB] = sortDirection === 'asc' ? [a, b] : [b, a]

  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB
  }

  if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
    return (valueA === valueB) ? 0 : (valueA ? -1 : 1)
  }

  if (valueA instanceof Date && valueB instanceof Date) {
    return valueA.getTime() - valueB.getTime()
  }

  return String(valueA).localeCompare(String(valueB))
}

export const getSortedObjectsByKey = <T> (array: T[], sortKey: keyof T, sortDirection: SortType = 'asc'): T[] => {
  if (sortDirection === 'none') {
    return array
  }

  return array.toSorted((a, b) => {
    return getSortedValues(a[sortKey], b[sortKey], sortDirection)
  })
}

export const getSortedArray = <T> (array: T[], sortDirection: SortType = 'asc'): T[] => {
  if (sortDirection === 'none') {
    return array
  }

  return array.toSorted((a, b) => {
    return getSortedValues(a, b, sortDirection)
  })
}
