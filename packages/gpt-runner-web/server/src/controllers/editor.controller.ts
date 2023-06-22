import { launchEditorByPathAndContent, sendSuccessResponse, verifyParamsByZod } from '@nicepkg/gpt-runner-shared/node'
import type { OpenEditorReqParams, OpenEditorResData } from '@nicepkg/gpt-runner-shared/common'
import { OpenEditorReqParamsSchema } from '@nicepkg/gpt-runner-shared/common'
import type { ControllerConfig } from '../types'
import { getValidFinalPath } from '../services/valid-path'

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
  ],
}
