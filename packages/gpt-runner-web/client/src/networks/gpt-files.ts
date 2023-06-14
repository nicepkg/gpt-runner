import type { BaseResponse, GetGptFilesReqParams, GetGptFilesTreeResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export interface FetchGptFilesTreeParams extends GetGptFilesReqParams {
}

export type FetchGptFilesTreeRes = BaseResponse<GetGptFilesTreeResData>

export async function fetchGptFilesTree(params: FetchGptFilesTreeParams): Promise<FetchGptFilesTreeRes> {
  const { rootPath } = params

  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files?rootPath=${rootPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
