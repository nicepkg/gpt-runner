import type { SingleFileConfig, UserConfig } from '../types'
import { DEFAULT_EXCLUDE_FILES, SECRET_KEY_PLACEHOLDER } from './constants'
import { EnvConfig } from './env-config'

export function singleFileConfigWithDefault(singleFileConfig?: Partial<SingleFileConfig>): SingleFileConfig {
  return {
    ...singleFileConfig,
  }
}

export function userConfigWithDefault(userConfig?: Partial<UserConfig>): UserConfig {
  return {
    model: {
      type: 'openai',
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0.9,
      maxTokens: 2000,
      ...userConfig?.model,
    },
    rootPath: process.cwd(),
    includes: null,
    excludes: DEFAULT_EXCLUDE_FILES,
    exts: ['.gpt.md'],
    respectGitIgnore: true,
    ...userConfig,
  }
}

export interface ResolveSingleFileCConfigParams {
  userConfig: UserConfig
  singleFileConfig: SingleFileConfig
}

export function resolveSingleFileConfig(params: ResolveSingleFileCConfigParams, withDefault = true, safe = false): SingleFileConfig {
  const userConfig = withDefault ? userConfigWithDefault(params.userConfig) : params.userConfig
  const singleFileConfig = withDefault ? singleFileConfigWithDefault(params.singleFileConfig) : params.singleFileConfig

  let resolvedConfig: SingleFileConfig = {
    ...singleFileConfig,
    model: {
      ...userConfig.model,
      ...singleFileConfig.model,
    } as SingleFileConfig['model'],
  }

  if (safe)
    resolvedConfig = resetSingleFileConfigUnsafeKey(resolvedConfig)

  return resolvedConfig
}

export function resetUserConfigUnsafeKey(userConfig: UserConfig): UserConfig {
  if (userConfig.model?.openaiKey || (userConfig.model?.type === 'openai' && EnvConfig.get('OPENAI_KEY')))
    userConfig.model.openaiKey = SECRET_KEY_PLACEHOLDER

  return userConfig
}

export function resetSingleFileConfigUnsafeKey(singleFileConfig: SingleFileConfig): SingleFileConfig {
  if (singleFileConfig.model?.openaiKey)
    singleFileConfig.model.openaiKey = ''

  return singleFileConfig
}
