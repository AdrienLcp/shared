export const getObjectKeys = <T extends Record<string, unknown>> (obj: T): Array<keyof T> => {
  return Object.keys(obj)
}

export const getObjectEntries = <T extends Record<string, T[keyof T]>> (obj: T): Array<[keyof T, T[keyof T]]> => {
  return Object.entries(obj)
}
