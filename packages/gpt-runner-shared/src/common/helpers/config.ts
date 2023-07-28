import { ChatModelType, type ReadonlyDeep, type SingleFileConfig, type UserConfig } from '../types'
import { getProcessCwd } from './common'
import { DEFAULT_EXCLUDE_FILES } from './constants'
import { EnvConfig } from './env-config'

export function singleFileConfigWithDefault(singleFileConfig?: Partial<SingleFileConfig>): SingleFileConfig {
  return {
    ...singleFileConfig,
  }
}

export function userConfigWithDefault(userConfig?: Partial<UserConfig>) {
  return ({
    model: {
      type: ChatModelType.Openai,
      modelName: 'gpt-3.5-turbo-16k',
      temperature: 0.9,
      maxTokens: 2000,
    },
    rootPath: EnvConfig.get('GPTR_DEFAULT_ROOT_PATH') || getProcessCwd(),
    includes: null,
    excludes: DEFAULT_EXCLUDE_FILES,
    exts: ['.gpt.md'],
    respectGitIgnore: true,
    urlConfig: {},
    ...userConfig,
  } as const) satisfies ReadonlyDeep<UserConfig>
}

export interface ResolveSingleFileCConfigParams {
  userConfig: UserConfig
  singleFileConfig: SingleFileConfig
}

export function resolveSingleFileConfig(params: ResolveSingleFileCConfigParams, withDefault = true): SingleFileConfig {
  let userConfig = (withDefault ? userConfigWithDefault(params.userConfig) : params.userConfig) as UserConfig
  const singleFileConfig = withDefault ? singleFileConfigWithDefault(params.singleFileConfig) : params.singleFileConfig

  userConfig = removeUserConfigUnsafeKey(userConfig)

  const resolvedConfig: SingleFileConfig = {
    ...singleFileConfig,
    model: {
      ...userConfig.model,
      ...singleFileConfig.model!,
    },
  }

  return resolvedConfig
}

export function removeUserConfigUnsafeKey(userConfig: UserConfig): UserConfig {
  const userConfigClone: UserConfig = {
    ...userConfig,
    model: {
      ...userConfig.model!,
    },
  }

  if (userConfigClone.model?.secrets)
    delete userConfigClone.model.secrets

  return userConfigClone
}
