import { type BaseResponse, type GetProjectConfigResData, type GetUserConfigReqParams, type GetUserConfigResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'

export async function fetchUserConfig(params: GetUserConfigReqParams): Promise<BaseResponse<GetUserConfigResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/config/user-config?${objectToQueryString({
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

export async function fetchProjectInfo(): Promise<BaseResponse<GetProjectConfigResData>> {
  const res = await fetch(`${getGlobalConfig().serverBaseUrl}/api/config`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
