/* eslint-disable unused-imports/no-unused-vars */
import { Debug } from '@nicepkg/gpt-runner-shared/common'
import { sendFailResponse } from '@nicepkg/gpt-runner-shared/node'
import type { NextFunction, Request, Response } from 'express'

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  const debug = new Debug('middleware.ts')
  debug.error(String(err))

  // console.error(err.stack) // Log the error stack trace
  sendFailResponse(res, {
    message: err.message,
  })
  res.end()
}
