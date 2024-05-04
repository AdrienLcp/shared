export type SortType = 'asc' | 'desc' | 'none'

const getSortedValues = <T> (a: T, b: T, sortDirection: SortType): [T, T] => {
  return sortDirection === 'asc' ? [a, b] : [b, a]
}

const getSortedByTypes = <T> (a: T, b: T, sortDirection: SortType): number => {
  const [valueA, valueB] = getSortedValues(a, b, sortDirection)

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

export const getSortedObjectsArray = <T> (array: T[], sortKey: keyof T, sortDirection: SortType = 'asc'): T[] => {
  if (sortDirection === 'none') {
    return array
  }

  return array.toSorted((a, b) => {
    return getSortedByTypes(a[sortKey], b[sortKey], sortDirection)
  })
}

export const getSortedArray = <T> (array: T[], sortDirection: SortType = 'asc'): T[] => {
  if (sortDirection === 'none') {
    return array
  }

  return array.toSorted((a, b) => {
    return getSortedByTypes(a, b, sortDirection)
  })
}
