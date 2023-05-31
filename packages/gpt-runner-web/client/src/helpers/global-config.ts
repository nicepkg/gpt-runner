import { getSearchParams } from '@nicepkg/gpt-runner-shared/browser'

export const globalConfig = {
  rootPath: '/Users/yangxiaoming/Documents/codes/gpt-runner' || getSearchParams('rootPath'),
}
