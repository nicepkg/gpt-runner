import type { BaseResponse, GetStorageReqParams, GetStorageResData, SaveStorageReqParams, SaveStorageResData } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export interface GetServerStorageParams extends GetStorageReqParams {
}

export type GetServerStorageRes = BaseResponse<GetStorageResData>

export async function getServerStorage(params: GetServerStorageParams): Promise<GetServerStorageRes> {
  const { storageName, key } = params

  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/storage?storageName=${storageName}&key=${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}

export interface SaveServerStorageParams extends SaveStorageReqParams {
}

export type SaveServerStorageRes = BaseResponse<SaveStorageResData>

export async function saveServerStorage(params: SaveServerStorageParams): Promise<SaveServerStorageRes> {
  const { storageName, key, value } = params

  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/storage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ storageName, key, value }),
  })
  const data = await res.json()
  return data
}
