import fs from 'node:fs'
import path from 'node:path'
import { getGptFiles, getGptFilesInfo, gptFilesInfoToTree, loadUserConfig } from '@nicepkg/gpt-runner-core'
import type { ControllerConfig } from '../types'
import { sendFailResponse, sendSuccessResponse } from '../utils/request'

export const gptFilesControllers: ControllerConfig = {
  namespacePath: '/gpt-files',
  controllers: [
    {
      url: '/tree',
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

        if (!fs.existsSync(finalPath) || fs.statSync(finalPath).isFile()) {
          sendFailResponse(res, {
            message: 'rootPath is not a valid directory',
          })

          return
        }

        const { config: userConfig } = await loadUserConfig(finalPath)

        if (userConfig.openai?.openaiKey)
          userConfig.openai.openaiKey = ''

        const gptFilePaths = await getGptFiles({
          rootPath: finalPath,
          exts: userConfig.exts,
          includes: userConfig.includes,
          excludes: userConfig.excludes,
          respectGitignore: userConfig.respectGitignore,
        })

        console.log('gptFilePaths', gptFilePaths, userConfig)

        const gptFilesInfo = await getGptFilesInfo({
          filepaths: gptFilePaths,
          userConfig,
        })

        const gptFilesInfoTree = await gptFilesInfoToTree({
          gptFilesInfo,
        })

        sendSuccessResponse(res, {
          data: {
            tree: gptFilesInfoTree,
          },
        })
      },
    },
  ],
}
