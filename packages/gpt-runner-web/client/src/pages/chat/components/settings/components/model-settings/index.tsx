import type { AiPersonConfig, GlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType, resolveAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import type { FC, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { useGlobalAiPersonConfig } from '../../../../../../hooks/use-user-config.hook'
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
  aiPersonFileSourcePath?: string
  aiPersonConfig?: AiPersonConfig
  globalAiPersonConfig?: GlobalAiPersonConfig
}

export type ModelSettingsProps = ModelSettingsTitleViewProps | ModelSettingsSecretsViewProps | ModelSettingsModelViewProps

type ModelSettingsPropsMerge = Omit<ModelSettingsTitleViewProps, 'viewType'> & Omit<ModelSettingsSecretsViewProps, 'viewType'> & Omit<ModelSettingsModelViewProps, 'viewType'> & { viewType: ModelSettingsViewType }

export const ModelSettings: FC<ModelSettingsProps> = memo((props) => {
  const { rootPath, aiPersonFileSourcePath, aiPersonConfig: aiPersonConfigFromParams, globalAiPersonConfig: globalAiPersonConfigFromParams, viewType, modelType } = props as ModelSettingsPropsMerge

  const { aiPersonConfig: aiPersonConfigFromRemote, globalAiPersonConfig: globalAiPersonConfigFromRemote } = useGlobalAiPersonConfig({
    rootPath,
    aiPersonFileSourcePath,
    enabled: !aiPersonConfigFromParams && viewType === 'model',
  })

  const aiPersonConfig = aiPersonConfigFromParams || aiPersonConfigFromRemote
  const globalAiPersonConfig = globalAiPersonConfigFromParams || globalAiPersonConfigFromRemote

  const resolvedAiPersonConfig = useMemo(() => {
    if (!globalAiPersonConfig || !aiPersonConfig)
      return {}

    const result = resolveAiPersonConfig({
      globalAiPersonConfig,
      aiPersonConfig,
    })

    if (modelType && result.model?.type !== modelType)
      return undefined

    return result
  }, [aiPersonConfig, globalAiPersonConfig, modelType])

  const finalModelType = modelType || resolvedAiPersonConfig?.model?.type || ChatModelType.Openai

  const modelTypeViewMap: Record<ChatModelType, Record<ModelSettingsViewType, () => ReactNode>> = {
    [ChatModelType.Anthropic]: {
      secrets: () => <AnthropicSecretsSettings />,
      model: () => <AnthropicModelSettings rootPath={rootPath} aiPersonConfig={resolvedAiPersonConfig} />,
      title: () => <>Anthropic</>,
    },
    [ChatModelType.HuggingFace]: {
      secrets: () => <></>,
      model: () => <></>,
      title: () => <>Hugging Face</>,
    },
    [ChatModelType.Openai]: {
      secrets: () => <OpenaiSecretsSettings />,
      model: () => <OpenaiModelSettings rootPath={rootPath} aiPersonConfig={resolvedAiPersonConfig} />,
      title: () => <>OpenAI</>,
    },
  }

  return <>{modelTypeViewMap[finalModelType][viewType]()}</>
})

ModelSettings.displayName = 'ModelSettings'
