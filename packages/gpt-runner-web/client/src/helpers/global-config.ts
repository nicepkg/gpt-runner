import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'

declare global {
  interface Window {
    globalConfig?: {
      rootPath?: string
      serverBaseUrl?: string
      initialRoutePath?: string
    }
  }
}

export const globalConfig = {
  rootPath: window?.globalConfig?.rootPath || '/Users/yangxiaoming/Documents/codes/gpt-runner' || getSearchParams('rootPath'),
  initialRoutePath: window?.globalConfig?.initialRoutePath || '/',
  serverBaseUrl: window?.globalConfig?.serverBaseUrl || 'http://localhost:3003',
}
