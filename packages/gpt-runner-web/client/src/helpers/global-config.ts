import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'
import type { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, toUnixPath, urlRemoveLocalhost } from '@nicepkg/gpt-runner-shared/common'
import { getLang } from './i18n'

export interface GlobalConfig {
  rootPath: string
  serverBaseUrl: string
  initialRoutePath: string
  showDiffCodesBtn: boolean
  showInsertCodesBtn: boolean
  defaultLangId: LocaleLang
}

window.__DEFAULT_GLOBAL_CONFIG__ = {
  rootPath: getSearchParams('rootPath'),
  initialRoutePath: '/chat',
  serverBaseUrl: urlRemoveLocalhost(EnvConfig.get('GPTR_BASE_SERVER_URL')),
  showDiffCodesBtn: false,
  showInsertCodesBtn: false,
  defaultLangId: getLang(),
}

export function getGlobalConfig() {
  const result = window.getGlobalConfig()
  return {
    ...result,
    rootPath: toUnixPath(result.rootPath || EnvConfig.get('GPTR_DEFAULT_ROOT_PATH')),
  } satisfies GlobalConfig
}
