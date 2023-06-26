import { objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import type { BaseResponse, GetGptFileInfoReqParams, GetGptFileInfoResData, GetGptFilesReqParams, GetGptFilesResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function fetchGptFilesTree(params: GetGptFilesReqParams): Promise<BaseResponse<GetGptFilesResData>> {
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

export async function getGptFileInfo(params: GetGptFileInfoReqParams): Promise<BaseResponse<GetGptFileInfoResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files/get-gpt-file-info?${objectToQueryString({
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
