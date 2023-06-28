import { type BaseResponse, type GetProjectConfigResData, type GetUserConfigReqParams, type GetUserConfigResData, objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import { getGlobalConfig } from '../helpers/global-config'
import { myFetch } from '../helpers/fetch'

export async function fetchUserConfig(params: GetUserConfigReqParams): Promise<BaseResponse<GetUserConfigResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/config/user-config?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function fetchProjectInfo(): Promise<BaseResponse<GetProjectConfigResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/config`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
