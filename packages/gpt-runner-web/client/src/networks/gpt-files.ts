import type { BaseResponse, GptFileInfo, GptFileInfoTree } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'

export interface FetchGptFilesTreeParams {
  rootPath: string
}

export type FetchGptFilesTreeResponse = BaseResponse<{
  filesInfo: GptFileInfo[]
  filesInfoTree: GptFileInfoTree
}>

export async function fetchGptFilesTree(params: FetchGptFilesTreeParams): Promise<FetchGptFilesTreeResponse> {
  const { rootPath } = params

  const res = await fetch(`${EnvConfig.get('BASE_SERVER_URL')}/api/gpt-files-info?rootPath=${rootPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
