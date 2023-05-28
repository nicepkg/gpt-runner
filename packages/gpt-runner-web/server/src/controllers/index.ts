import type { Router } from 'express'
import type { ControllerConfig } from '../types'
import { chatgptControllers } from './chatgpt.controller'
import { configControllers } from './config.controller'
import { gptFilesControllers } from './gpt-files.controller'

export function processControllers(router: Router) {
  const allControllersConfig: ControllerConfig[] = [
    chatgptControllers,
    configControllers,
    gptFilesControllers,
  ]

  allControllersConfig.forEach((controllerConfig) => {
    const { namespacePath, controllers } = controllerConfig

    controllers.forEach((controller) => {
      const { url, method, handler } = controller
      router[method](`${namespacePath}${url}`, handler)
    })
  })
}
