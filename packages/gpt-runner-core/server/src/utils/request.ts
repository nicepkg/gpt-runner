import type { Response } from 'express'

interface CustomResponse<T = any> {
  type: 'Success' | 'Fail'
  status?: number
  message?: string
  data?: T
}

export type SuccessResponse<T = any> = Omit<CustomResponse<T>, 'type'> & { type: 'Success' }
export type FailResponse<T = any> = Omit<CustomResponse<T>, 'type'> & { type: 'Fail' }

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

export function sendSuccessResponse<T>(res: Response, options: Omit<SuccessResponse<T>, 'type'>): Response {
  return res.status(options.status || 200).json(buildSuccessResponse(options))
}

export function sendFailResponse<T>(res: Response, options: Omit<FailResponse<T>, 'type'>): Response {
  return res.status(options.status || 400).json(buildFailResponse(options))
}
