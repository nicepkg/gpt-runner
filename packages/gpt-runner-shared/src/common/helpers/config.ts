import type { SingleFileConfig, UserConfig } from '../types'

export function singleFileConfigWithDefault(singleFileConfig?: Partial<SingleFileConfig>): SingleFileConfig {
  return {
    ...singleFileConfig,
  }
}

export function userConfigWithDefault(userConfig?: Partial<UserConfig>): UserConfig {
  return {
    model: {
      type: 'openai',
      openaiKey: process.env.OPENAI_KEY!,
      modelName: 'gpt-3.5-turbo',
      temperature: 0.9,
      maxTokens: 2000,
      ...userConfig?.model,
    },
    rootPath: process.cwd(),
    includes: null,
    excludes: null,
    exts: ['.gpt.md'],
    respectGitignore: true,
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
  if (userConfig.model?.openaiKey)
    userConfig.model.openaiKey = ''

  return userConfig
}

export function resetSingleFileConfigUnsafeKey(singleFileConfig: SingleFileConfig): SingleFileConfig {
  if (singleFileConfig.model?.openaiKey)
    singleFileConfig.model.openaiKey = ''

  return singleFileConfig
}
