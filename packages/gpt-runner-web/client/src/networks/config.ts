import { objectToQueryString } from '@nicepkg/gpt-runner-shared/common'
import type { BaseResponse, GetAppConfigReqParams, GetAppConfigResData, GetProjectConfigResData, GetUserConfigReqParams, GetUserConfigResData, MarkAsVisitedAppConfigReqParams, MarkAsVisitedAppConfigResData } from '@nicepkg/gpt-runner-shared/common'
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

export async function fetchAppConfig(params: GetAppConfigReqParams): Promise<BaseResponse<GetAppConfigResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/config/app-config?${objectToQueryString({
    ...params,
  })}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

export async function markAsVisitedAppConfig(params: MarkAsVisitedAppConfigReqParams): Promise<BaseResponse<MarkAsVisitedAppConfigResData>> {
  return await myFetch(`${getGlobalConfig().serverBaseUrl}/api/config/mark-as-visited-app-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
}
