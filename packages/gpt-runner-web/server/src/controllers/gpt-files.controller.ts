import path from 'node:path'
import { getGptFilesInfo, loadUserConfig } from '@nicepkg/gpt-runner-core'
import { PathUtils, sendFailResponse, sendSuccessResponse } from '@nicepkg/gpt-runner-shared/node'
import type { ControllerConfig } from '../types'

export const gptFilesControllers: ControllerConfig = {
  namespacePath: '/gpt-files-info',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const { rootPath } = req.query

        if (!rootPath) {
          sendFailResponse(res, {
            message: 'rootPath is required',
          })

          return
        }

        if (typeof rootPath !== 'string') {
          sendFailResponse(res, {
            message: 'rootPath must be a string',
          })

          return
        }

        const finalPath = path.resolve(rootPath)

        if (!PathUtils.isDirectory(finalPath)) {
          sendFailResponse(res, {
            message: 'rootPath is not a valid directory',
          })

          return
        }

        const { config: userConfig } = await loadUserConfig(finalPath)

        if (userConfig.openai?.openaiKey)
          userConfig.openai.openaiKey = ''

        console.log('userConfig', userConfig)

        const { filesInfo, filesInfoTree } = await getGptFilesInfo({
          userConfig,
        })

        sendSuccessResponse(res, {
          data: {
            filesInfo,
            filesInfoTree,
          },
        })
      },
    },
  ],
}
