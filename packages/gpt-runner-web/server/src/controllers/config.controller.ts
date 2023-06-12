import { PathUtils, sendFailResponse, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetUserConfigReqParams, GetUserConfigResData } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, GetUserConfigReqParamsSchema, resetUserConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import { loadUserConfig } from '@nicepkg/gpt-runner-core'
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
    {
      url: '/env.js',
      method: 'get',
      handler: async (req, res) => {
        const envMap = EnvConfig.getClientEnvVarsInServerSide()

        // response a javascript file
        res.setHeader('Content-Type', 'application/javascript')
        res.send(`window.__env__ = ${JSON.stringify(envMap)}`)
      },
    },
    {
      url: '/user-config',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetUserConfigReqParams

        verifyParamsByZod(query, GetUserConfigReqParamsSchema)

        const { rootPath } = query
        const finalPath = PathUtils.resolve(rootPath)

        if (!PathUtils.isDirectory(finalPath)) {
          sendFailResponse(res, {
            message: 'rootPath is not a valid directory',
          })

          return
        }

        let { config: userConfig } = await loadUserConfig(finalPath)
        userConfig = resetUserConfigUnsafeKey(userConfig)

        sendSuccessResponse(res, {
          data: {
            userConfig,
          } satisfies GetUserConfigResData,
        })
      },
    },
  ],
}
