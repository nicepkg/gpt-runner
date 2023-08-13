import type { AiPresetFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType, resolveAiPresetFileConfig } from '@nicepkg/gpt-runner-shared/common'
import type { FC, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { useUserConfig } from '../../../../../../hooks/use-user-config.hook'
import { AnthropicSecretsSettings } from './anthropic-settings/secrets-settings'
import { AnthropicModelSettings } from './anthropic-settings/model-settings'
import { OpenaiSecretsSettings } from './openai-settings/secrets-settings'
import { OpenaiModelSettings } from './openai-settings/model-settings'

export type ModelSettingsViewType = 'secrets' | 'model' | 'title'

export interface ModelSettingsBaseViewProps {
  viewType: ModelSettingsViewType
}

export interface ModelSettingsTitleViewProps extends ModelSettingsBaseViewProps {
  viewType: 'title'
  modelType?: ChatModelType
}

export interface ModelSettingsSecretsViewProps extends ModelSettingsBaseViewProps {
  viewType: 'secrets'
  modelType: ChatModelType
}

export interface ModelSettingsModelViewProps extends ModelSettingsBaseViewProps {
  viewType: 'model'
  rootPath: string
  modelType?: ChatModelType
  aiPresetFilePath?: string
  aiPresetFileConfig?: AiPresetFileConfig
  userConfig?: UserConfig
}

export type ModelSettingsProps = ModelSettingsTitleViewProps | ModelSettingsSecretsViewProps | ModelSettingsModelViewProps

type ModelSettingsPropsMerge = Omit<ModelSettingsTitleViewProps, 'viewType'> & Omit<ModelSettingsSecretsViewProps, 'viewType'> & Omit<ModelSettingsModelViewProps, 'viewType'> & { viewType: ModelSettingsViewType }

export const ModelSettings: FC<ModelSettingsProps> = memo((props) => {
  const { rootPath, aiPresetFilePath, aiPresetFileConfig: aiPresetFileConfigFromParams, userConfig: userConfigFromParams, viewType, modelType } = props as ModelSettingsPropsMerge

  const { aiPresetFileConfig: aiPresetFileConfigFromRemote, userConfig: userConfigFromRemote } = useUserConfig({
    rootPath,
    aiPresetFilePath,
    enabled: !aiPresetFileConfigFromParams && viewType === 'model',
  })

  const aiPresetFileConfig = aiPresetFileConfigFromParams || aiPresetFileConfigFromRemote
  const userConfig = userConfigFromParams || userConfigFromRemote

  const resolvedAiPresetFileConfig = useMemo(() => {
    if (!userConfig || !aiPresetFileConfig)
      return {}

    const result = resolveAiPresetFileConfig({
      userConfig,
      aiPresetFileConfig,
    })

    if (modelType && result.model?.type !== modelType)
      return undefined

    return result
  }, [aiPresetFileConfig, userConfig, modelType])

  const finalModelType = modelType || resolvedAiPresetFileConfig?.model?.type || ChatModelType.Openai

  const modelTypeViewMap: Record<ChatModelType, Record<ModelSettingsViewType, () => ReactNode>> = {
    [ChatModelType.Anthropic]: {
      secrets: () => <AnthropicSecretsSettings />,
      model: () => <AnthropicModelSettings rootPath={rootPath} aiPresetFileConfig={resolvedAiPresetFileConfig} />,
      title: () => <>Anthropic</>,
    },
    [ChatModelType.HuggingFace]: {
      secrets: () => <></>,
      model: () => <></>,
      title: () => <>Hugging Face</>,
    },
    [ChatModelType.Openai]: {
      secrets: () => <OpenaiSecretsSettings />,
      model: () => <OpenaiModelSettings rootPath={rootPath} aiPresetFileConfig={resolvedAiPresetFileConfig} />,
      title: () => <>OpenAI</>,
    },
  }

  return <>{modelTypeViewMap[finalModelType][viewType]()}</>
})

ModelSettings.displayName = 'ModelSettings'
