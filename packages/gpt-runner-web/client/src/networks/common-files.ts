import { type BaseResponse, type GetCommonFilesReqParams, type GetCommonFilesResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function fetchCommonFilesTree(params: GetCommonFilesReqParams): Promise<BaseResponse<GetCommonFilesResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/common-files?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
