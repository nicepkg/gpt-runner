import { type BaseResponse, type GetCommonFilesReqParams, type GetCommonFilesResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function fetchCommonFilesTree(params: GetCommonFilesReqParams): Promise<BaseResponse<GetCommonFilesResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/common-files?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
