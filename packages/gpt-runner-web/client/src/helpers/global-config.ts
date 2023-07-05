import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'
import type { LocaleLang } from '@nicepkg/gpt-runner-shared/common'
import { EnvConfig, toUnixPath, urlRemoveLocalhost } from '@nicepkg/gpt-runner-shared/common'
import { getLang } from './i18n'

export interface GlobalConfig {
  rootPath: string
  serverBaseUrl: string
  baseUrl: string // browser, in vscode it's vscode-resource
  webWorkerBaseUrl: string
  initialRoutePath: string
  showDiffCodesBtn: boolean
  showInsertCodesBtn: boolean
  defaultLangId: LocaleLang
  showIdeFileContextOptions: boolean
  showUserSelectedTextContextOptions: boolean
  editFileInIde: boolean
}

window.__DEFAULT_GLOBAL_CONFIG__ = {
  rootPath: getSearchParams('rootPath'),
  serverBaseUrl: urlRemoveLocalhost(EnvConfig.get('GPTR_BASE_SERVER_URL')),
  baseUrl: '',
  webWorkerBaseUrl: '',
  initialRoutePath: '/chat',
  showDiffCodesBtn: false,
  showInsertCodesBtn: false,
  defaultLangId: getLang(),
  showIdeFileContextOptions: false,
  showUserSelectedTextContextOptions: false,
  editFileInIde: false,
}

export function getGlobalConfig() {
  const result = window.getGlobalConfig()
  return {
    ...result,
    rootPath: toUnixPath(result.rootPath || EnvConfig.get('GPTR_DEFAULT_ROOT_PATH')),
  } satisfies GlobalConfig
}
