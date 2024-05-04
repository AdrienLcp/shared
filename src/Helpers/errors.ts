type ErrorWithStatus = {
  status?: number
}

export const isErrorWithStatus = (error: unknown, status: number): error is ErrorWithStatus => {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const err = error as ErrorWithStatus
    return err.status === status
  }
  return false
}
