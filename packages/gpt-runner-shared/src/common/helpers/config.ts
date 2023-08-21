import { type AiPersonConfig, ChatModelType, type GlobalAiPersonConfig, type ReadonlyDeep } from '../types'
import { getProcessCwd } from './common'
import { DEFAULT_EXCLUDE_FILES } from './constants'
import { EnvConfig } from './env-config'

export function aiPersonConfigWithDefault(aiPersonConfig?: Partial<AiPersonConfig>): AiPersonConfig {
  return {
    ...aiPersonConfig,
  }
}

export function globalAiPersonConfigWithDefault(globalAiPersonConfig?: Partial<GlobalAiPersonConfig>) {
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
    ...globalAiPersonConfig,
  } as const) satisfies ReadonlyDeep<GlobalAiPersonConfig>
}

export interface ResolveAiPersonCConfigParams {
  globalAiPersonConfig: GlobalAiPersonConfig
  aiPersonConfig: AiPersonConfig
}

export function resolveAiPersonConfig(params: ResolveAiPersonCConfigParams, withDefault = true): AiPersonConfig {
  let globalAiPersonConfig = (withDefault ? globalAiPersonConfigWithDefault(params.globalAiPersonConfig) : params.globalAiPersonConfig) as GlobalAiPersonConfig
  const aiPersonConfig = withDefault ? aiPersonConfigWithDefault(params.aiPersonConfig) : params.aiPersonConfig

  globalAiPersonConfig = removeGlobalAiPersonConfigUnsafeKey(globalAiPersonConfig)

  const resolvedConfig: AiPersonConfig = {
    ...aiPersonConfig,
    model: {
      ...globalAiPersonConfig.model,
      ...aiPersonConfig.model!,
    },
  }

  return resolvedConfig
}

export function removeGlobalAiPersonConfigUnsafeKey(globalAiPersonConfig: GlobalAiPersonConfig): GlobalAiPersonConfig {
  const globalAiPersonConfigClone: GlobalAiPersonConfig = {
    ...globalAiPersonConfig,
    model: {
      ...globalAiPersonConfig.model!,
    },
  }

  if (globalAiPersonConfigClone.model?.secrets)
    delete globalAiPersonConfigClone.model.secrets

  return globalAiPersonConfigClone
}
