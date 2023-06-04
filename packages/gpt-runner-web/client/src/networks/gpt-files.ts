import type { BaseResponse, GetGptFilesReqParams, GptFilesTreeResData } from '@nicepkg/gpt-runner-shared/common'
import { globalConfig } from '../helpers/global-config'

export interface FetchGptFilesTreeParams extends GetGptFilesReqParams {
}

export type FetchGptFilesTreeRes = BaseResponse<GptFilesTreeResData>

export async function fetchGptFilesTree(params: FetchGptFilesTreeParams): Promise<FetchGptFilesTreeRes> {
  const { rootPath } = params

  const res = await fetch(`${globalConfig.serverBaseUrl}/api/gpt-files?rootPath=${rootPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
