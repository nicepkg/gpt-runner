import type { Request, Response } from 'express'

export interface ControllerConfig {
  namespacePath: string
  controllers: Controller[]
}
export interface Controller {
  url: string
  method: 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'
  handler: (req: Request, res: Response) => Promise<void>
}
