import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { ChatModelType, resolveSingleFileConfig } from '@nicepkg/gpt-runner-shared/common'
import type { FC, ReactNode } from 'react'
import { memo, useMemo } from 'react'
import { useUserConfig } from '../../../../../../hooks/use-user-config.hook'
import { OpenaiSecretsSettings } from './openai-settings/secrets-settings'
import { OpenaiModelSettings } from './openai-settings/model-settings'

export type ModelSettingsViewType = 'secrets' | 'model' | 'title'

export interface ModelSettingsProps {
  rootPath?: string
  singleFilePath?: string
  singleFileConfig?: SingleFileConfig
  userConfig?: UserConfig
  viewType: ModelSettingsViewType
}

export const ModelSettings: FC<ModelSettingsProps> = memo((props) => {
  const { rootPath, singleFilePath, singleFileConfig: singleFileConfigFromParams, userConfig: userConfigFromParams, viewType } = props

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

  const finalModelType = resolvedSingleFileConfig?.model?.type || ChatModelType.Openai

  const modelTypeViewMap: Record<ChatModelType, Record<ModelSettingsViewType, () => ReactNode>> = {
    [ChatModelType.Openai]: {
      secrets: () => <OpenaiSecretsSettings singleFileConfig={resolvedSingleFileConfig} />,
      model: () => <OpenaiModelSettings singleFileConfig={resolvedSingleFileConfig} />,
      title: () => <>OpenAI</>,
    },
    [ChatModelType.HuggingFace]: {
      secrets: () => <></>,
      model: () => <></>,
      title: () => <>Hugging Face</>,
    },
  }

  return <>{modelTypeViewMap[finalModelType][viewType]()}</>
})

ModelSettings.displayName = 'ModelSettings'
