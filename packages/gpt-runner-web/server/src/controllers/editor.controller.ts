import { FileUtils, PathUtils, launchEditorByPathAndContent, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { CreateFilePathReqParams, CreateFilePathResData, DeleteFilePathReqParams, DeleteFilePathResData, GetFileInfoReqParams, GetFileInfoResData, OpenEditorReqParams, OpenEditorResData, RenameFilePathReqParams, RenameFilePathResData, SaveFileContentReqParams, SaveFileContentResData } from '@nicepkg/gpt-runner-shared/common'
import { CreateFilePathReqParamsSchema, DeleteFilePathReqParamsSchema, GetFileInfoReqParamsSchema, OpenEditorReqParamsSchema, RenameFilePathReqParamsSchema, SaveFileContentReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../services/valid-path'

export const editorControllers: ControllerConfig = {
  namespacePath: '/editor',
  controllers: [
    {
      url: '/open-editor',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as OpenEditorReqParams

        verifyParamsByZod(body, OpenEditorReqParamsSchema)

        const { rootPath, path, matchContent } = body
        const finalPath = getValidFinalPath({
          path,
          rootPath,
          assertType: 'file',
          fieldName: 'path',
        })

        await launchEditorByPathAndContent({
          path: finalPath,
          matchContent,
        })

        sendSuccessResponse(res, {
          data: null satisfies OpenEditorResData,
        })
      },
    },

    {
      url: '/create-file-path',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as CreateFilePathReqParams

        verifyParamsByZod(body, CreateFilePathReqParamsSchema)

        const { fileFullPath, isDir } = body

        if (isDir) {
          await FileUtils.ensurePath({
            filePath: fileFullPath,
          })
        }
        else {
          await FileUtils.writeFile({
            filePath: fileFullPath,
            content: '',
            valid: false,
          })
        }

        sendSuccessResponse(res, {
          data: null satisfies CreateFilePathResData,
        })
      },
    },
    {
      url: '/rename-file-path',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as RenameFilePathReqParams

        verifyParamsByZod(body, RenameFilePathReqParamsSchema)

        const { oldFileFullPath, newFileFullPath } = body

        await FileUtils.movePath({
          oldPath: oldFileFullPath,
          newPath: newFileFullPath,
        })

        sendSuccessResponse(res, {
          data: null satisfies RenameFilePathResData,
        })
      },
    },
    {
      url: '/delete-file-path',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as DeleteFilePathReqParams

        verifyParamsByZod(body, DeleteFilePathReqParamsSchema)

        const { fileFullPath } = body

        await FileUtils.deletePath(fileFullPath)

        sendSuccessResponse(res, {
          data: null satisfies DeleteFilePathResData,
        })
      },
    },
    {
      url: '/get-file-info',
      method: 'get',
      requireSafe: true,
      handler: async (req, res) => {
        const query = req.query as GetFileInfoReqParams

        verifyParamsByZod(query, GetFileInfoReqParamsSchema)

        const { fileFullPath } = query

        const content = await FileUtils.readFile({ filePath: fileFullPath })
        const isDir = PathUtils.isDirectory(fileFullPath)

        sendSuccessResponse(res, {
          data: {
            content,
            isDir,
          } satisfies GetFileInfoResData,
        })
      },
    },
    {
      url: '/save-file-content',
      method: 'post',
      requireSafe: true,
      handler: async (req, res) => {
        const body = req.body as SaveFileContentReqParams

        verifyParamsByZod(body, SaveFileContentReqParamsSchema)

        const { fileFullPath, content } = body

        await FileUtils.writeFile({ filePath: fileFullPath, content })

        sendSuccessResponse(res, {
          data: null satisfies SaveFileContentResData,
        })
      },
    },
  ],
}
