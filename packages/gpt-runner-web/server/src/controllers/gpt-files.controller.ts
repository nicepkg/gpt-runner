import type { GptInitFileName } from '@nicepkg/gpt-runner-core'
import { getGptFilesInfo, initGptFiles, loadGlobalAiPersonConfig, parseAiPersonFile } from '@nicepkg/gpt-runner-core'
import { sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetAiPersonFilesReqParams, GetAiPersonFilesResData, GetAiPersonTreeItemInfoReqParams, GetAiPersonTreeItemInfoResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { Debug, GetAiPersonFilesReqParamsSchema, GetAiPersonTreeItemInfoReqParamsSchema, InitGptFilesReqParamsSchema, removeGlobalAiPersonConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../helpers/valid-path'

export const gptFilesControllers: ControllerConfig = {
  namespacePath: '/gpt-files',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const debug = new Debug('gpt-files.controller')
        const query = req.query as GetAiPersonFilesReqParams

        verifyParamsByZod(query, GetAiPersonFilesReqParamsSchema)

        const { rootPath } = query
        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        let { config: globalAiPersonConfig } = await loadGlobalAiPersonConfig(finalPath)
        globalAiPersonConfig = removeGlobalAiPersonConfigUnsafeKey(globalAiPersonConfig)

        debug.log('globalAiPersonConfig', globalAiPersonConfig)

        const { filesInfo, filesInfoTree } = await getGptFilesInfo({
          globalAiPersonConfig,
        })

        sendSuccessResponse(res, {
          data: {
            filesInfo,
            filesInfoTree,
          } satisfies GetAiPersonFilesResData,
        })
      },
    },
    {
      url: '/init-gpt-files',
      method: 'post',
      requireSafe: true,
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
    {
      url: '/get-gpt-file-info',
      method: 'get',
      handler: async (req, res) => {
        const debug = new Debug('gpt-files.controller')
        const query = req.query as GetAiPersonTreeItemInfoReqParams

        verifyParamsByZod(query, GetAiPersonTreeItemInfoReqParamsSchema)

        const { rootPath, filePath } = query

        const finalRootPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        const finalFilePath = getValidFinalPath({
          path: filePath,
          rootPath: finalRootPath,
          assertType: 'file',
          fieldName: 'filePath',
        })

        let { config: globalAiPersonConfig } = await loadGlobalAiPersonConfig(finalRootPath)
        globalAiPersonConfig = removeGlobalAiPersonConfigUnsafeKey(globalAiPersonConfig)

        debug.log('globalAiPersonConfig', globalAiPersonConfig)

        const aiPersonConfig = await parseAiPersonFile({
          filePath: finalFilePath,
          globalAiPersonConfig,
        })

        sendSuccessResponse(res, {
          data: {
            globalAiPersonConfig,
            aiPersonConfig,
          } satisfies GetAiPersonTreeItemInfoResData,
        })
      },
    },
  ],
}
