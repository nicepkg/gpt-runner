import type { GptFilesInfoToTree } from '@nicepkg/gpt-runner-core'
import type { BaseResponse } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'

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
