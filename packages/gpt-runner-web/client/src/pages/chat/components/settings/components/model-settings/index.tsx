import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType, resolveSingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
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
  singleFilePath?: string
  singleFileConfig?: SingleFileConfig
  userConfig?: UserConfig
}

export type ModelSettingsProps = ModelSettingsTitleViewProps | ModelSettingsSecretsViewProps | ModelSettingsModelViewProps

type ModelSettingsPropsMerge = Omit<ModelSettingsTitleViewProps, 'viewType'> & Omit<ModelSettingsSecretsViewProps, 'viewType'> & Omit<ModelSettingsModelViewProps, 'viewType'> & { viewType: ModelSettingsViewType }

export const ModelSettings: FC<ModelSettingsProps> = memo((props) => {
  const { rootPath, singleFilePath, singleFileConfig: singleFileConfigFromParams, userConfig: userConfigFromParams, viewType, modelType } = props as ModelSettingsPropsMerge

  const { singleFileConfig: singleFileConfigFromRemote, userConfig: userConfigFromRemote } = useUserConfig({
    rootPath,
    singleFilePath,
    enabled: !singleFileConfigFromParams && viewType === 'model',
  })

  const singleFileConfig = singleFileConfigFromParams || singleFileConfigFromRemote
  const userConfig = userConfigFromParams || userConfigFromRemote

  const resolvedSingleFileConfig = useMemo(() => {
    if (!userConfig || !singleFileConfig)
      return {}

    const result = resolveSingleFileConfig({
      userConfig,
      singleFileConfig,
    })

    if (modelType && result.model?.type !== modelType)
      return undefined

    return result
  }, [singleFileConfig, userConfig, modelType])

  const finalModelType = modelType || resolvedSingleFileConfig?.model?.type || ChatModelType.Openai

  const modelTypeViewMap: Record<ChatModelType, Record<ModelSettingsViewType, () => ReactNode>> = {
    [ChatModelType.Anthropic]: {
      secrets: () => <AnthropicSecretsSettings />,
      model: () => <AnthropicModelSettings rootPath={rootPath} singleFileConfig={resolvedSingleFileConfig} />,
      title: () => <>Anthropic</>,
    },
    [ChatModelType.HuggingFace]: {
      secrets: () => <></>,
      model: () => <></>,
      title: () => <>Hugging Face</>,
    },
    [ChatModelType.Openai]: {
      secrets: () => <OpenaiSecretsSettings />,
      model: () => <OpenaiModelSettings rootPath={rootPath} singleFileConfig={resolvedSingleFileConfig} />,
      title: () => <>OpenAI</>,
    },
  }

  return <>{modelTypeViewMap[finalModelType][viewType]()}</>
})

ModelSettings.displayName = 'ModelSettings'
