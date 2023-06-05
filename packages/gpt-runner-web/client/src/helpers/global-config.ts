import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'

export interface GlobalConfig {
  rootPath: string
  serverBaseUrl: string
  initialRoutePath: string
}

window.__DEFAULT_GLOBAL_CONFIG__ = {
  rootPath: getSearchParams('rootPath') || '/Users/yangxiaoming/Documents/codes/gpt-runner',
  initialRoutePath: '/',
  serverBaseUrl: 'http://localhost:3003',
}

export function getGlobalConfig() {
  return window.getGlobalConfig()
}
