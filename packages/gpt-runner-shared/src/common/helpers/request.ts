import type { FailResponse, SuccessResponse } from '../types'

export function buildSuccessResponse<T>(options: Omit<SuccessResponse<T>, 'type'>): SuccessResponse<T> {
  return {
    type: 'Success',
    status: options.status || 200,
    ...options,
  }
}

export function buildFailResponse<T>(options: Omit<FailResponse<T>, 'type'>): FailResponse<T> {
  return {
    type: 'Fail',
    status: options.status || 400,
    ...options,
  }
}
