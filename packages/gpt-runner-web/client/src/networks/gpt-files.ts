import type { GptFilesInfoToTree } from '@nicepkg/gpt-runner-core'
import { EnvConfig } from '../../../env-config'
import type { BaseResponse } from '../types/common'

export interface FetchGptFilesTreeParams {
  rootPath: string
}

export type FetchGptFilesTreeResponse = BaseResponse<{
  tree: GptFilesInfoToTree
}>

export async function fetchGptFilesTree(params: FetchGptFilesTreeParams): Promise<FetchGptFilesTreeResponse> {
  const { rootPath } = params

  const res = await fetch(`${EnvConfig.get('BASE_SERVER_URL')}/api/gpt-files/tree?rootPath=${rootPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
