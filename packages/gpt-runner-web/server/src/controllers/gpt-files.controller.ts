import type { GptInitFileName } from '@nicepkg/gpt-runner-core'
import { getGptFilesInfo, initGptFiles, loadUserConfig, parseGptFile } from '@nicepkg/gpt-runner-core'
import { sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetGptFileInfoReqParams, GetGptFileInfoResData, GetGptFilesReqParams, GetGptFilesResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { Debug, GetGptFileInfoReqParamsSchema, GetGptFilesReqParamsSchema, InitGptFilesReqParamsSchema, removeUserConfigUnsafeKey } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../services/valid-path'

export const gptFilesControllers: ControllerConfig = {
  namespacePath: '/gpt-files',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const debug = new Debug('gpt-files.controller')
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
          } satisfies GetGptFilesResData,
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
        const query = req.query as GetGptFileInfoReqParams

        verifyParamsByZod(query, GetGptFileInfoReqParamsSchema)

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

        let { config: userConfig } = await loadUserConfig(finalRootPath)
        userConfig = removeUserConfigUnsafeKey(userConfig)

        debug.log('userConfig', userConfig)

        const singleFileConfig = await parseGptFile({
          filePath: finalFilePath,
          userConfig,
        })

        sendSuccessResponse(res, {
          data: {
            userConfig,
            singleFileConfig,
          } satisfies GetGptFileInfoResData,
        })
      },
    },
  ],
}
