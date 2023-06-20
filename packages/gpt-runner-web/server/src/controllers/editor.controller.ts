import { PathUtils, launchEditorByPathAndContent, sendFailResponse, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { OpenEditorReqParams, OpenEditorResData } from '@nicepkg/gpt-runner-shared/common'
import { OpenEditorReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'

export const editorControllers: ControllerConfig = {
  namespacePath: '/editor',
  controllers: [
    {
      url: '/open-editor',
      method: 'post',
      handler: async (req, res) => {
        const body = req.body as OpenEditorReqParams

        verifyParamsByZod(body, OpenEditorReqParamsSchema)

        const { rootPath, path, matchContent } = body
        const finalPath = rootPath ? PathUtils.resolve(rootPath, path) : PathUtils.resolve(path)

        if (!PathUtils.isFile(finalPath)) {
          sendFailResponse(res, {
            message: 'path is not a valid file',
          })

          return
        }

        await launchEditorByPathAndContent({
          path: finalPath,
          matchContent,
        })

        sendSuccessResponse(res, {
          data: null satisfies OpenEditorResData,
        })
      },
    },
  ],
}
