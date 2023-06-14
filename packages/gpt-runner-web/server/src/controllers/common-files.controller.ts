import { PathUtils, getCommonFileTree, sendFailResponse, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import { type GetCommonFilesReqParams, GetCommonFilesReqParamsSchema, type GetCommonFilesResData } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'

export const commonFilesControllers: ControllerConfig = {
  namespacePath: '/common-files',
  controllers: [
    {
      url: '/',
      method: 'get',
      handler: async (req, res) => {
        const query = req.query as GetCommonFilesReqParams

        verifyParamsByZod(query, GetCommonFilesReqParamsSchema)

        const DEFAULT_EXCLUDE_EXTS = [
          '.jpg',
          '.png',
          '.gif',
          '.jpeg',
          '.svg',
          '.mp4',
          '.mp3',
          '.wav',
          '.flac',
          '.ogg',
          '.webm',
          '.ico',
          '.pdf',
          '.doc',
          '.docx',
          '.xls',
          '.xlsx',
          '.ppt',
          '.pptx',
          '.zip',
          '.rar',
          '.7z',
          '.tar',
          '.gz',
          '.tgz',
          '.bz2',
          '.xz',
          '.exe',
          '.dmg',
          '.pkg',
          '.deb',
          '.rpm',
          '.msi',
          '.apk',
          '.ipa',
          '.iso',
          '.img',
          '.bin',
          '.dll',
          '.so',
          '.dylib',
          '.a',
          '.lib',
          '.o',
          '.obj',
          '.class',
          '.jar',
          '.war',
          '.ear',
          '.swf',
          '.fla',
          '.as',
          '.as3',
          '.mxml',
          '.swc',
          '.swd',
          '.swz',
          '.swt',
          '.air',
          '.ane',
        ]

        const {
          rootPath,
          // ignore not code file ext
          excludeExts = DEFAULT_EXCLUDE_EXTS,
        } = query
        const finalPath = PathUtils.resolve(rootPath)

        if (!PathUtils.isDirectory(finalPath)) {
          sendFailResponse(res, {
            message: 'rootPath is not a valid directory',
          })

          return
        }

        const { tree, exts } = await getCommonFileTree({
          rootPath,
          isValidPath: (filePath) => {
            return !excludeExts.some(ext => filePath.endsWith(ext))
          },
        })

        sendSuccessResponse(res, {
          data: {
            filesInfoTree: tree,
            fileExts: exts,
          } satisfies GetCommonFilesResData,
        })
      },
    },
  ],
}
