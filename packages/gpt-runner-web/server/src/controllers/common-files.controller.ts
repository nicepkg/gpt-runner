import { PathUtils, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import { DEFAULT_EXCLUDE_FILE_EXTS, type GetCommonFilesReqParams, GetCommonFilesReqParamsSchema, type GetCommonFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { getCommonFileTree, loadUserConfig } from '@nicepkg/gpt-runner-core'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../helpers/valid-path'

export const commonFilesControllers: ControllerConfig = {
  namespacePath: '/common-files',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetCommonFilesReqParams

        verifyParamsByZod(query, GetCommonFilesReqParamsSchema)

        const {
          rootPath,
          // ignore not code file ext
          excludeExts = DEFAULT_EXCLUDE_FILE_EXTS,
        } = query

        const finalPath = getValidFinalPath({
          path: rootPath,
          assertType: 'directory',
          fieldName: 'rootPath',
        })

        const { config: userConfig } = await loadUserConfig(finalPath)

        const allFileExts: Set<string> = new Set()

        const { tree, includeFileExts } = await getCommonFileTree({
          rootPath,
          isValidPath: (filePath) => {
            if (PathUtils.isFile(filePath)) {
              const ext = PathUtils.extname(filePath)
              ext && allFileExts.add(ext)
            }

            return !excludeExts.some(ext => filePath.endsWith(ext))
          },
          includes: userConfig.includes,
          excludes: userConfig.excludes,
          respectGitIgnore: userConfig.respectGitIgnore,
        })

        sendSuccessResponse(res, {
          data: {
            filesInfoTree: tree,
            includeFileExts,
            allFileExts: [...allFileExts],
          } satisfies GetCommonFilesResData,
        })
      },
    },
  ],
}
