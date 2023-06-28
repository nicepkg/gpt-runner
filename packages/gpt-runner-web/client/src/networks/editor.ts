import type { BaseResponse, OpenEditorReqParams, OpenEditorResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function openEditor(params: OpenEditorReqParams): Promise<BaseResponse<OpenEditorResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/editor/open-editor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rootPath: getGlobalConfig().rootPath,
      ...params,
    }),
  })
}
