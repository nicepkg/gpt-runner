import type { Response } from 'express'
import type { z } from 'zod'
import type { FailResponse, SuccessResponse } from '../../common'
import { buildFailResponse, buildSuccessResponse, verifyZod } from '../../common'

export function sendSuccessResponse<T>(res: Response, options: Omit<SuccessResponse<T>, 'type'>): Response {
  return res.status(options.status || 200).json(buildSuccessResponse(options))
}

export function sendFailResponse<T>(res: Response, options: Omit<FailResponse<T>, 'type'>): Response {
  return res.status(options.status || 400).json(buildFailResponse(options))
}

export function verifyParamsByZod<T>(params: T, schema: z.ZodSchema<T>): void {
  verifyZod(schema, params)
}
