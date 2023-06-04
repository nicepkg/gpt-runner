import type { BaseResponse, GetStateReqParams, GetStateResData, SaveStateReqParams, SaveStateResData } from '@nicepkg/gpt-runner-shared/common'
import { globalConfig } from '../helpers/global-config'

export interface FetchStateParams extends GetStateReqParams {
}

export type FetchStateRes = BaseResponse<GetStateResData>

export async function fetchState(params: FetchStateParams): Promise<FetchStateRes> {
  const { key } = params

  const res = await fetch(`${globalConfig.serverBaseUrl}/api/state?key=${key}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}

export interface SaveStateParams extends SaveStateReqParams {
}

export type SaveStateRes = BaseResponse<SaveStateResData>

export async function saveState(params: SaveStateParams): Promise<SaveStateRes> {
  const { key, state } = params

  const res = await fetch(`${globalConfig.serverBaseUrl}/api/state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ key, state }),
  })
  const data = await res.json()
  return data
}
