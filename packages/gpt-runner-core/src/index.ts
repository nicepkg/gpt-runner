import { addNodejsPolyfill } from '@nicepkg/gpt-runner-shared/node'

addNodejsPolyfill()

export * from './core'
export * from './langchain'

export interface UserConfig {
  configFile?: string | false
  configDeps?: string[]
}
