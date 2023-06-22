import type { GptInitFileName } from '@nicepkg/gpt-runner-core'
import { getGptFilesInfo, initGptFiles, loadUserConfig } from '@nicepkg/gpt-runner-core'
import { sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetGptFilesReqParams, GetGptFilesTreeResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { Debug, GetGptFilesReqParamsSchema, InitGptFilesReqParamsSchema, removeUserConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../services/valid-path'

const debug = new Debug('gpt-files.controller')

export const gptFilesControllers: ControllerConfig = {
  namespacePath: '/gpt-files',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetGptFilesReqParams

        verifyParamsByZod(query, GetGptFilesReqParamsSchema)

        const { rootPath } = query
        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        let { config: userConfig } = await loadUserConfig(finalPath)
        userConfig = removeUserConfigUnsafeKey(userConfig)

        debug.log('userConfig', userConfig)

        const { filesInfo, filesInfoTree } = await getGptFilesInfo({
          userConfig,
        })

        sendSuccessResponse(res, {
          data: {
            filesInfo,
            filesInfoTree,
          } satisfies GetGptFilesTreeResData,
        })
      },
    },
    {
      url: '/init-gpt-files',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as InitGptFilesReqParams

        verifyParamsByZod(body, InitGptFilesReqParamsSchema)

        const { rootPath, gptFilesNames } = body

        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        await initGptFiles({
          rootPath: finalPath,
          gptFilesNames: gptFilesNames as GptInitFileName[],
        })

        sendSuccessResponse(res, {
          data: null satisfies InitGptFilesResData,
        })
      },
    },
  ],
}
