import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'

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
  serverBaseUrl: '',
  showDiffCodesBtn: false,
  showInsertCodesBtn: false,
}

export function getGlobalConfig() {
  return window.getGlobalConfig()
}
