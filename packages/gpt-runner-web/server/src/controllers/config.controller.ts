import { sendSuccessResponse } from '@nicepkg/gpt-runner-shared/node'
import pkg from '../../../package.json'
import type { ControllerConfig } from '../types'

export const configControllers: ControllerConfig = {
  namespacePath: '/config',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        sendSuccessResponse(res, {
          data: {
            version: pkg.version,
          },
        })
      },
    },
  ],
}
