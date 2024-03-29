import { objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import type { BaseResponse, GetGptFileInfoReqParams, GetGptFileInfoResData, GetGptFilesReqParams, GetGptFilesResData, InitGptFilesReqParams, InitGptFilesResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function fetchGptFilesTree(params: GetGptFilesReqParams): Promise<BaseResponse<GetGptFilesResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function initGptFiles(params: InitGptFilesReqParams): Promise<BaseResponse<InitGptFilesResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files/init-gpt-files?${objectToQueryString({
    ...params,
  })}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}

export async function getGptFileInfo(params: GetGptFileInfoReqParams): Promise<BaseResponse<GetGptFileInfoResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/gpt-files/get-gpt-file-info?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
