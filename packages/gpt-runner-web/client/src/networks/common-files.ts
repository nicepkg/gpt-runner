import { type BaseResponse, type GetCommonFilesReqParams, type GetCommonFilesResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export interface FetchCommonFilesTreeParams extends GetCommonFilesReqParams {
}

export type FetchCommonFilesTreeRes = BaseResponse<GetCommonFilesResData>

export async function fetchCommonFilesTree(params: FetchCommonFilesTreeParams): Promise<FetchCommonFilesTreeRes> {
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
