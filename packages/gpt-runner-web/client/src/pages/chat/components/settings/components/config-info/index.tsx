import { type FC, memo, useMemo } from 'react'
import type { AiPersonConfig, GlobalAiPersonConfig } from '@nicepkg/gpt-runner-shared/common'
import { useGlobalStore } from '../../../../../../store/zustand/global'
import type { MessageCodeBlockTheme } from '../../../../../../components/chat-message-code-block'
import { MessageCodeBlock } from '../../../../../../components/chat-message-code-block'
import { useGlobalAiPersonConfig } from '../../../../../../hooks/use-user-config.hook'
import { ConfigInfoWrapper } from '../../settings.styles'
import { FormTitle } from '../../../../../../components/form-title'
import { FlexColumn } from '../../../../../../styles/global.styles'
import { LoadingView } from '../../../../../../components/loading-view'
import { useDarkTheme } from '../../../../../../hooks/use-css-var-color.hook'

export interface ConfigInfoProps {
  rootPath?: string
  chatId?: string
  aiPersonConfig?: AiPersonConfig
  globalAiPersonConfig?: GlobalAiPersonConfig
}

export const ConfigInfo: FC<ConfigInfoProps> = memo((props) => {
  const { rootPath, chatId, aiPersonConfig: aiPersonConfigFromProps, globalAiPersonConfig: globalAiPersonConfigFromProps } = props
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

  const { globalAiPersonConfig: globalAiPersonConfigFromRes, aiPersonConfig: aiPersonConfigFromRes, isLoading: getGptFileInfoIsLoading } = useGlobalAiPersonConfig({
    rootPath,
    aiPersonFileSourcePath: gptFileTreeItem?.path,
    enabled: !aiPersonConfigFromProps || !globalAiPersonConfigFromProps,
  })

  const globalAiPersonConfig = globalAiPersonConfigFromProps || globalAiPersonConfigFromRes
  const aiPersonConfig = aiPersonConfigFromProps || aiPersonConfigFromRes

  const globalConfigInfo = JSON.stringify(globalAiPersonConfig, null, 4)
  const aiPersonConfigInfo = JSON.stringify(aiPersonConfig, null, 4)
  const gptFileName = gptFileTreeItem?.path.split('/').pop()

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        gptr.config.json
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderAiPersonConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        {gptFileName}
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={aiPersonConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  if (!globalAiPersonConfig && !aiPersonConfig)
    return null

  return <FlexColumn style={{ position: 'relative', width: '100%' }}>

    {getGptFileInfoIsLoading && <LoadingView absolute></LoadingView>}
    {renderAiPersonConfigInfo()}
    {renderGlobalConfigInfo()}
  </FlexColumn>
})

ConfigInfo.displayName = 'ConfigInfo'
