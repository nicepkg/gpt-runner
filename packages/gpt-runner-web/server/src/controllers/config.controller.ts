import { checkNodeVersion, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetProjectConfigResData, GetUserConfigReqParams, GetUserConfigResData } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, GetUserConfigReqParamsSchema, removeUserConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import { loadUserConfig } from '@nicepkg/gpt-runner-core'
import pkg from '../../../package.json'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../services/valid-path'

export const configControllers: ControllerConfig = {
  namespacePath: '/config',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const nodeVersionValidMessage = checkNodeVersion() || ''

        sendSuccessResponse(res, {
          data: {
            gptRunnerVersion: pkg.version,
            nodeVersion: process.version,
            nodeVersionValidMessage,
          } satisfies GetProjectConfigResData,
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

        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        let { config: userConfig } = await loadUserConfig(finalPath)
        userConfig = removeUserConfigUnsafeKey(userConfig)

        sendSuccessResponse(res, {
          data: {
            userConfig,
          } satisfies GetUserConfigResData,
        })
      },
    },
  ],
}
