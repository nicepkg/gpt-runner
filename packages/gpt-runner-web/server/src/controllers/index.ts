import type { NextFunction, Router } from 'express'
import type { Controller, ControllerConfig } from '../types'
import { chatgptControllers } from './chatgpt.controller'
import { configControllers } from './config.controller'
import { gptFilesControllers } from './gpt-files.controller'
import { storageControllers } from './storage.controller'

export function processControllers(router: Router) {
  const allControllersConfig: ControllerConfig[] = [
    chatgptControllers,
    configControllers,
    gptFilesControllers,
    storageControllers,
  ]

  allControllersConfig.forEach((controllerConfig) => {
    const { namespacePath, controllers } = controllerConfig

    controllers.forEach((controller) => {
      const { url, method, handler } = controller

      const withCatchHandler: Controller['handler'] = async function (this: any, ...args) {
        try {
          return await handler.apply(this, args)
        }
        catch (error) {
          const next = args[args.length - 1] as NextFunction
          next(error)
        }
      }

      router[method](`${namespacePath}${url}`, withCatchHandler)
    })
  })
}
