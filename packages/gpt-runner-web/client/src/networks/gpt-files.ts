import { objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import type { BaseResponse, GetGptFilesReqParams, GetGptFilesTreeResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
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

export async function initGptFiles(params: InitGptFilesReqParams): Promise<BaseResponse<InitGptFilesResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files/init-gpt-files?${objectToQueryString({
    ...params,
  })}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return data
}
