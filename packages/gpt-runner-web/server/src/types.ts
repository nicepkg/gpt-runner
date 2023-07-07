import type { WssActionName } from '@nicepkg/gpt-runner-shared/common'
import type { NextFunction, Request, Response } from 'express'

export interface MyRequest extends Request<Record<string, any>, any, any, Record<string, any>> {
  isSafe: boolean
}

export interface Controller {
  url: string
  requireSafe?: boolean // only allow localhost access
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'
  handler: (req: MyRequest, res: Response, next: NextFunction) => Promise<void>
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
