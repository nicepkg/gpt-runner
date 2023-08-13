import { type AiPresetFileConfig, ChatModelType, type ReadonlyDeep, type UserConfig } from '../types'
import { getProcessCwd } from './common'
import { DEFAULT_EXCLUDE_FILES } from './constants'
import { EnvConfig } from './env-config'

export function aiPresetFileConfigWithDefault(aiPresetFileConfig?: Partial<AiPresetFileConfig>): AiPresetFileConfig {
  return {
    ...aiPresetFileConfig,
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

export interface ResolveAiPresetFileCConfigParams {
  userConfig: UserConfig
  aiPresetFileConfig: AiPresetFileConfig
}

export function resolveAiPresetFileConfig(params: ResolveAiPresetFileCConfigParams, withDefault = true): AiPresetFileConfig {
  let userConfig = (withDefault ? userConfigWithDefault(params.userConfig) : params.userConfig) as UserConfig
  const aiPresetFileConfig = withDefault ? aiPresetFileConfigWithDefault(params.aiPresetFileConfig) : params.aiPresetFileConfig

  userConfig = removeUserConfigUnsafeKey(userConfig)

  const resolvedConfig: AiPresetFileConfig = {
    ...aiPresetFileConfig,
    model: {
      ...userConfig.model,
      ...aiPresetFileConfig.model!,
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
