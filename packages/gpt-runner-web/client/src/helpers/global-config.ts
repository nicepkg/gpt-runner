import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'
import { EnvConfig, toUnixPath, urlRemoveLocalhost } from '@nicepkg/gpt-runner-shared/common'

export interface GlobalConfig {
  rootPath: string
  serverBaseUrl: string
  initialRoutePath: string
  showDiffCodesBtn: boolean
  showInsertCodesBtn: boolean
}

window.__DEFAULT_GLOBAL_CONFIG__ = {
  rootPath: getSearchParams('rootPath') || '/Users/yangxiaoming/Documents/codes/gpt-runner',
  initialRoutePath: '/',
  serverBaseUrl: urlRemoveLocalhost(EnvConfig.get('GPTR_BASE_SERVER_URL')),
  showDiffCodesBtn: false,
  showInsertCodesBtn: false,
}

export function getGlobalConfig() {
  const result = window.getGlobalConfig()
  return {
    ...result,
    rootPath: toUnixPath(result.rootPath),
  } satisfies GlobalConfig
}
