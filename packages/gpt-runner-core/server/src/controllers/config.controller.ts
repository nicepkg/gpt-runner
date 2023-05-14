import pkg from '../../../package.json'
import type { ControllerConfig } from '../types'
import { sendSuccessResponse } from '../utils/request'

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
