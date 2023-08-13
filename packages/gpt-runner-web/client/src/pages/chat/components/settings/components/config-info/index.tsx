import { type FC, memo, useMemo } from 'react'
import type { AiPresetFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import type { MessageCodeBlockTheme } from '../../../../../../components/chat-message-code-block'
import { MessageCodeBlock } from '../../../../../../components/chat-message-code-block'
import { useUserConfig } from '../../../../../../hooks/use-user-config.hook'
import { ConfigInfoWrapper } from '../../settings.styles'
import { FormTitle } from '../../../../../../components/form-title'
import { FlexColumn } from '../../../../../../styles/global.styles'
import { LoadingView } from '../../../../../../components/loading-view'
import { useDarkTheme } from '../../../../../../hooks/use-css-var-color.hook'

export interface ConfigInfoProps {
  rootPath?: string
  chatId?: string
  aiPresetFileConfig?: AiPresetFileConfig
  userConfig?: UserConfig
}

export const ConfigInfo: FC<ConfigInfoProps> = memo((props) => {
  const { rootPath, chatId, aiPresetFileConfig: aiPresetFileConfigFromProps, userConfig: userConfigFromProps } = props
  const { getGptFileTreeItemFromChatId } = useGlobalStore()

  const isDark = useDarkTheme()
  const codeBlockTheme: MessageCodeBlockTheme = useMemo(() => {
    return isDark ? 'dark' : 'light'
  }, [isDark])

  const gptFileTreeItem = useMemo(() => {
    if (!chatId)
      return null
    return getGptFileTreeItemFromChatId(chatId)
  }, [chatId, getGptFileTreeItemFromChatId])

  const { userConfig: userConfigFromRes, aiPresetFileConfig: aiPresetFileConfigFromRes, isLoading: getGptFileInfoIsLoading } = useUserConfig({
    rootPath,
    aiPresetFilePath: gptFileTreeItem?.path,
    enabled: !aiPresetFileConfigFromProps || !userConfigFromProps,
  })

  const userConfig = userConfigFromProps || userConfigFromRes
  const aiPresetFileConfig = aiPresetFileConfigFromProps || aiPresetFileConfigFromRes

  const globalConfigInfo = JSON.stringify(userConfig, null, 4)
  const aiPresetFileConfigInfo = JSON.stringify(aiPresetFileConfig, null, 4)
  const gptFileName = gptFileTreeItem?.path.split('/').pop()

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        gptr.config.json
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderAiPresetFileConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        {gptFileName}
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={aiPresetFileConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  if (!userConfig && !aiPresetFileConfig)
    return null

  return <FlexColumn style={{ position: 'relative', width: '100%' }}>

    {getGptFileInfoIsLoading && <LoadingView absolute></LoadingView>}
    {renderAiPresetFileConfigInfo()}
    {renderGlobalConfigInfo()}
  </FlexColumn>
})

ConfigInfo.displayName = 'ConfigInfo'
