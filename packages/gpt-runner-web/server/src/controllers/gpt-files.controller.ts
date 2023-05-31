import { getGptFilesInfo, loadUserConfig } from '@nicepkg/gpt-runner-core'
import { PathUtils, sendFailResponse, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { GetGptFilesReqParams, GptFilesTreeResData } from '@nicepkg/gpt-runner-shared/common'
import { GetGptFilesReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'

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
        const finalPath = PathUtils.resolve(rootPath)

        if (!PathUtils.isDirectory(finalPath)) {
          sendFailResponse(res, {
            message: 'rootPath is not a valid directory',
          })

          return
        }

        const { config: userConfig } = await loadUserConfig(finalPath)

        if (userConfig.model?.openaiKey)
          userConfig.model.openaiKey = ''

        console.log('userConfig', userConfig)

        const { filesInfo, filesInfoTree } = await getGptFilesInfo({
          userConfig,
        })

        sendSuccessResponse(res, {
          data: {
            filesInfo,
            filesInfoTree,
          } satisfies GptFilesTreeResData,
        })
      },
    },
  ],
}
