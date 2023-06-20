import { type BaseResponse, type GetGptFilesReqParams, type GetGptFilesTreeResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function fetchGptFilesTree(params: GetGptFilesReqParams): Promise<BaseResponse<GetGptFilesTreeResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files?${objectToQueryString({
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
