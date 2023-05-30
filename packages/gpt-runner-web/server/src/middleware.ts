/* eslint-disable unused-imports/no-unused-vars */
import { sendFailResponse } from '@nicepkg/gpt-runner-shared/node'
import type { NextFunction, Request, Response } from 'express'

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  // console.error(err.stack) // Log the error stack trace
  sendFailResponse(res, {
    message: err.message,
  })
  res.end()
}
