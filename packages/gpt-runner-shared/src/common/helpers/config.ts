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

export function resolveSingleFileConfig(params: ResolveSingleFileCConfigParams, withDefault = true): SingleFileConfig {
  const userConfig = withDefault ? userConfigWithDefault(params.userConfig) : params.userConfig
  const singleFileConfig = withDefault ? singleFileConfigWithDefault(params.singleFileConfig) : params.singleFileConfig

  const resolvedConfig: SingleFileConfig = {
    ...singleFileConfig,
    model: {
      ...userConfig.model,
      ...singleFileConfig.model,
    } as SingleFileConfig['model'],
  }

  return resolvedConfig
}
