import { type FC, memo, useMemo } from 'react'
import type { SingleFileConfig, UserConfig } from '@nicepkg/gpt-runner-shared/common'
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
  singleFileConfig?: SingleFileConfig
  userConfig?: UserConfig
}

export const ConfigInfo: FC<ConfigInfoProps> = memo((props) => {
  const { rootPath, chatId, singleFileConfig: singleFileConfigFromProps, userConfig: userConfigFromProps } = props
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

  const { userConfig: userConfigFromRes, singleFileConfig: singleFileConfigFromRes, isLoading: getGptFileInfoIsLoading } = useUserConfig({
    rootPath,
    singleFilePath: gptFileTreeItem?.path,
    enabled: !singleFileConfigFromProps || !userConfigFromProps,
  })

  const userConfig = userConfigFromProps || userConfigFromRes
  const singleFileConfig = singleFileConfigFromProps || singleFileConfigFromRes

  const globalConfigInfo = JSON.stringify(userConfig, null, 4)
  const singleFileConfigInfo = JSON.stringify(singleFileConfig, null, 4)
  const gptFileName = gptFileTreeItem?.path.split('/').pop()

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        gptr.config.json
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderSingleFileConfigInfo = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        {gptFileName}
      </FormTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={singleFileConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  if (!userConfig && !singleFileConfig)
    return null

  return <FlexColumn style={{ position: 'relative', width: '100%' }}>

    {getGptFileInfoIsLoading && <LoadingView absolute></LoadingView>}
    {renderSingleFileConfigInfo()}
    {renderGlobalConfigInfo()}
  </FlexColumn>
})

ConfigInfo.displayName = 'ConfigInfo'
