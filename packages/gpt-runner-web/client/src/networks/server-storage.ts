import { type BaseResponse, type StorageGetItemReqParams, type StorageGetItemResData, type StorageSetItemReqParams, type StorageSetItemResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function getServerStorage(params: StorageGetItemReqParams): Promise<BaseResponse<StorageGetItemResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/storage?${objectToQueryString({
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

export async function saveServerStorage(params: StorageSetItemReqParams): Promise<BaseResponse<StorageSetItemResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/storage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return data
}
