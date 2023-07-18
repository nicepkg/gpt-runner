import type { NextFunction, Response, Router } from 'express'
import { WssActionName, WssUtils, buildFailResponse } from '@nicepkg/gpt-runner-shared/common'
import { sendFailResponse } from '@nicepkg/gpt-runner-shared/node'
import type { Controller, ControllerConfig, MyRequest } from '../types'
import { llmControllers } from './llm.controller'
import { commonFilesControllers } from './common-files.controller'
import { configControllers } from './config.controller'
import { gptFilesControllers } from './gpt-files.controller'
import { storageControllers } from './storage.controller'
import { allWsControllersConfig } from './ws'
import { editorControllers } from './editor.controller'

export function processControllers(router: Router) {
  const allControllersConfig: ControllerConfig[] = [
    llmControllers,
    commonFilesControllers,
    configControllers,
    editorControllers,
    gptFilesControllers,
    storageControllers,
  ]

  allControllersConfig.forEach((controllerConfig) => {
    const { namespacePath, controllers } = controllerConfig

    controllers.forEach((controller) => {
      const { url, method, requireSafe, handler } = controller

      const withCatchHandler: Controller['handler'] = async function (this: any, ...args) {
        try {
          const req = args[0] as MyRequest
          const res = args[1] as Response
          if (requireSafe && !req.isSafe) {
            sendFailResponse(res, {
              message: 'This request is not allowed without localhost access!',
            })
            return
          }

          return await handler.apply(this, args)
        }
        catch (error) {
          const next = args[args.length - 1] as NextFunction
          next(error)
        }
      }

      router[method](`${namespacePath}${url}`, withCatchHandler as any)
    })
  })
}

export async function processWsControllers(server: any) {
  await WssUtils.instance.connect({ server })

  allWsControllersConfig.forEach((controllerConfig) => {
    const { controllers } = controllerConfig

    controllers.forEach((controller) => {
      const { actionName, handler } = controller

      WssUtils.instance.on(actionName, async (params: Record<string, any>) => {
        console.log(`[WS] ${actionName} params:`, params)
        try {
          return await handler(params as any)
        }
        catch (error: any) {
          const errRes = buildFailResponse({ data: error, message: error?.message || String(error) })

          WssUtils.instance.emit(actionName, {
            reqParams: params as any,
            res: errRes,
          })

          WssUtils.instance.emit(WssActionName.Error, {
            res: errRes,
          })
        }
      })
    })
  })
}
