import { type CSSProperties, type FC, memo, useMemo, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { StyledVSCodePanels } from '../../chat.styles'
import type { MessageCodeBlockTheme } from '../../../../components/chat-message-code-block'
import { MessageCodeBlock } from '../../../../components/chat-message-code-block'
import { useGlobalStore } from '../../../../store/zustand/global'
import { FlexColumn } from '../../../../styles/global.styles'
import { isDarkTheme } from '../../../../styles/themes'
import { getGptFileInfo } from '../../../../networks/gpt-files'
import { LoadingView } from '../../../../components/loading-view'
import { ConfigInfoTitle, ConfigInfoWrapper } from './settings.styles'
import { OpenaiSettings } from './components/openai-setting'
import { GeneralSettings } from './components/general'

enum SettingsTabId {
  ConfigInfo = 'configInfo',
  Settings = 'settings',
}

export interface SettingsProps {
  rootPath: string
  showSingleFileConfig?: boolean
  chatId?: string
}

export const Settings: FC<SettingsProps> = memo((props) => {
  const { rootPath, showSingleFileConfig, chatId } = props

  const { t } = useTranslation()
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.Settings)
  const { themeName, getGptFileTreeItemFromChatId } = useGlobalStore()
  const codeBlockTheme: MessageCodeBlockTheme = useMemo(() => {
    return isDarkTheme(themeName) ? 'dark' : 'light'
  }, [themeName])

  const gptFileTreeItem = useMemo(() => {
    if (!chatId)
      return null
    return getGptFileTreeItemFromChatId(chatId)
  }, [chatId, getGptFileTreeItemFromChatId])

  const { data: getGptFileInfoRes, isLoading: getGptFileInfoIsLoading } = useQuery({
    queryKey: ['settings-gpt-file-info', tabActiveId, gptFileTreeItem?.path],
    enabled: !!gptFileTreeItem?.path && tabActiveId === SettingsTabId.ConfigInfo,
    queryFn: () => getGptFileInfo({
      rootPath,
      filePath: gptFileTreeItem!.path,
    }),
  })

  const { userConfig, singleFileConfig } = getGptFileInfoRes?.data || {}

  const viewStyle: CSSProperties = {
    height: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  const globalConfigInfo = JSON.stringify(userConfig, null, 4)
  const singleFileConfigInfo = JSON.stringify(singleFileConfig, null, 4)
  const gptFileName = gptFileTreeItem?.path.split('/').pop()

  const renderOverrideSetting = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>{t('chat_page.settings_general')}</ConfigInfoTitle>
      <GeneralSettings></GeneralSettings>
      <ConfigInfoTitle>{t('chat_page.settings_openai_config')}</ConfigInfoTitle>
      <OpenaiSettings></OpenaiSettings>
    </ConfigInfoWrapper>
  }

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        gptr.config.json
      </ConfigInfoTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderSingleFileConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        {gptFileName}
      </ConfigInfoTitle>
      <MessageCodeBlock theme={codeBlockTheme} language='json' contents={singleFileConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  if (!showSingleFileConfig)
    return renderOverrideSetting()

  return <StyledVSCodePanels
    activeid={tabActiveId}
    style={viewStyle}
    onChange={(e: any) => {
      const activeId = e.target?.activeid as SettingsTabId
      setTabActiveId(activeId)
    }}
  >
    <VSCodePanelTab id={SettingsTabId.Settings}>{t('chat_page.settings_tab_settings')}</VSCodePanelTab>
    <VSCodePanelTab id={SettingsTabId.ConfigInfo}>{t('chat_page.settings_tab_config_info')}</VSCodePanelTab>

    <VSCodePanelView style={viewStyle} id={SettingsTabId.Settings}>
      {renderOverrideSetting()}
    </VSCodePanelView>
    <VSCodePanelView style={viewStyle} id={SettingsTabId.ConfigInfo}>
      <FlexColumn style={{ width: '100%' }}>
        {getGptFileInfoIsLoading && <LoadingView absolute></LoadingView>}

        {renderSingleFileConfigInfo()}
        {renderGlobalConfigInfo()}
      </FlexColumn>
    </VSCodePanelView>
  </StyledVSCodePanels>
})

Settings.displayName = 'Settings'
