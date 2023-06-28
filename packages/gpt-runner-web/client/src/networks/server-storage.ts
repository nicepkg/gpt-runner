import { type BaseResponse, type StorageGetItemReqParams, type StorageGetItemResData, type StorageSetItemReqParams, type StorageSetItemResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function getServerStorage(params: StorageGetItemReqParams): Promise<BaseResponse<StorageGetItemResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/storage?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function saveServerStorage(params: StorageSetItemReqParams): Promise<BaseResponse<StorageSetItemResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/storage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}
