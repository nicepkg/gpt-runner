import { checkNodeVersion, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetAppConfigReqParams, GetAppConfigResData, GetGlobalAiPersonConfigReqParams, GetGlobalAiPersonConfigResData, GetProjectConfigResData, MarkAsVisitedAppConfigReqParams, MarkAsVisitedAppConfigResData } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, GetAppConfigReqParamsSchema, GetGlobalAiPersonConfigReqParamsSchema, MarkAsVisitedAppConfigReqParamsSchema, removeGlobalAiPersonConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import { loadGlobalAiPersonConfig } from '@nicepkg/gpt-runner-core'
import pkg from '../../../package.json'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../helpers/valid-path'
import { AppConfigService } from '../services/app-config.service'

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
        const query = req.query as GetGlobalAiPersonConfigReqParams

        verifyParamsByZod(query, GetGlobalAiPersonConfigReqParamsSchema)

        const { rootPath } = query

        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        let { config: globalAiPersonConfig } = await loadGlobalAiPersonConfig(finalPath)
        globalAiPersonConfig = removeGlobalAiPersonConfigUnsafeKey(globalAiPersonConfig)

        sendSuccessResponse(res, {
          data: {
            globalAiPersonConfig,
          } satisfies GetGlobalAiPersonConfigResData,
        })
      },
    },
    {
      url: '/app-config',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetAppConfigReqParams

        verifyParamsByZod(query, GetAppConfigReqParamsSchema)

        const { langId } = query

        langId && AppConfigService.instance.updateLangId(langId)
        const currentAppConfig = await AppConfigService.instance.getCurrentAppConfig(true)

        sendSuccessResponse(res, {
          data: currentAppConfig satisfies GetAppConfigResData,
        })
      },
    },
    {
      url: '/mark-as-visited-app-config',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as MarkAsVisitedAppConfigReqParams

        verifyParamsByZod(body, MarkAsVisitedAppConfigReqParamsSchema)

        const { types } = body

        await AppConfigService.instance.markedAsVisited(types)

        sendSuccessResponse(res, {
          data: null satisfies MarkAsVisitedAppConfigResData,
        })
      },
    },
  ],
}
