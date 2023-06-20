import type { BaseResponse, OpenEditorReqParams, OpenEditorResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function openEditor(params: OpenEditorReqParams): Promise<BaseResponse<OpenEditorResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/editor/open-editor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rootPath: getGlobalConfig().rootPath,
      ...params,
    }),
  })
  const data = await res.json()
  return data
}
