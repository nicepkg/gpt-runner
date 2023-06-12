import type { WssActionName } from '@nicepkg/gpt-runner-shared/common'
import type { NextFunction, Request, Response } from 'express'

export interface Controller {
  url: string
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'
  handler: (req: Request<Record<string, any>, any, any, Record<string, any>>, res: Response, next: NextFunction) => Promise<void>
}
export interface ControllerConfig {
  namespacePath: string
  controllers: Controller[]
}

export interface WssController {
  actionName: WssActionName
  handler: (params: any) => Promise<void>
}

export interface WssControllerConfig {
  controllers: WssController[]
}
