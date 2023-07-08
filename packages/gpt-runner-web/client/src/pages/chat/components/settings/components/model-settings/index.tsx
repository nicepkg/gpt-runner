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

export interface ModelSettingsProps {
  rootPath?: string
  singleFilePath?: string
  singleFileConfig?: SingleFileConfig
  userConfig?: UserConfig
  modelType?: ChatModelType
  viewType: ModelSettingsViewType
}

export const ModelSettings: FC<ModelSettingsProps> = memo((props) => {
  const { rootPath, singleFilePath, singleFileConfig: singleFileConfigFromParams, userConfig: userConfigFromParams, viewType, modelType } = props

  const { singleFileConfig: singleFileConfigFromRemote, userConfig: userConfigFromRemote } = useUserConfig({
    rootPath,
    singleFilePath,
    enabled: !singleFileConfigFromParams,
  })

  const singleFileConfig = singleFileConfigFromParams || singleFileConfigFromRemote
  const userConfig = userConfigFromParams || userConfigFromRemote

  const resolvedSingleFileConfig = useMemo(() => {
    if (!userConfig || !singleFileConfig)
      return {}

    return resolveSingleFileConfig({
      userConfig,
      singleFileConfig,
    })
  }, [singleFileConfig, userConfig])

  const finalModelType = modelType || resolvedSingleFileConfig?.model?.type || ChatModelType.Openai

  const modelTypeViewMap: Record<ChatModelType, Record<ModelSettingsViewType, () => ReactNode>> = {
    [ChatModelType.Anthropic]: {
      secrets: () => <AnthropicSecretsSettings />,
      model: () => <AnthropicModelSettings singleFileConfig={resolvedSingleFileConfig} />,
      title: () => <>Anthropic</>,
    },
    [ChatModelType.HuggingFace]: {
      secrets: () => <></>,
      model: () => <></>,
      title: () => <>Hugging Face</>,
    },
    [ChatModelType.Openai]: {
      secrets: () => <OpenaiSecretsSettings />,
      model: () => <OpenaiModelSettings singleFileConfig={resolvedSingleFileConfig} />,
      title: () => <>OpenAI</>,
    },
  }

  return <>{modelTypeViewMap[finalModelType][viewType]()}</>
})

ModelSettings.displayName = 'ModelSettings'
