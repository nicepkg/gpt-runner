import type { BaseResponse, GetUserConfigReqParams, GetUserConfigResData } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig } from '@nicepkg/gpt-runner-shared/common'

export interface FetchUserConfigParams extends GetUserConfigReqParams {
}

export type FetchUserConfigRes = BaseResponse<GetUserConfigResData>

export async function fetchUserConfig(params: FetchUserConfigParams): Promise<FetchUserConfigRes> {
  const { rootPath } = params

  const res = await fetch(`${EnvConfig.get('BASE_SERVER_URL')}/api/config/user-config?rootPath=${rootPath}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}
