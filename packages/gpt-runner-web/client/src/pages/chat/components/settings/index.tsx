import { type CSSProperties, type FC, useMemo, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import { StyledVSCodePanels } from '../../chat.styles'
import type { MessageCodeBlockTheme } from '../../../../components/chat-message-code-block'
import { MessageCodeBlock } from '../../../../components/chat-message-code-block'
import { useGlobalStore } from '../../../../store/zustand/global'
import { useChatInstance } from '../../../../hooks/use-chat-instance.hook'
import { FlexColumn } from '../../../../styles/global.styles'
import { isDarkTheme } from '../../../../styles/themes'
import { ConfigInfoTitle, ConfigInfoWrapper } from './settings.styles'
import { OpenaiSettings } from './components/openai-setting'
import { GeneralSettings } from './components/general'

enum SettingsTabId {
  ConfigInfo = 'configInfo',
  Settings = 'settings',
}

export interface SettingsProps {
  showSingleFileConfig?: boolean
  chatId?: string
}

export const Settings: FC<SettingsProps> = (props) => {
  const { showSingleFileConfig, chatId } = props

  const { t } = useTranslation()
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.Settings)
  const { userConfig, themeName, getGptFileTreeItemFromChatId } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId })
  const codeBlockTheme: MessageCodeBlockTheme = useMemo(() => {
    return isDarkTheme(themeName) ? 'dark' : 'light'
  }, [themeName])

  const gptFileTreeItem = useMemo(() => {
    if (!chatId)
      return null
    return getGptFileTreeItemFromChatId(chatId)
  }, [chatId, getGptFileTreeItemFromChatId])

  const viewStyle: CSSProperties = {
    height: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  const globalConfigInfo = JSON.stringify(userConfig, null, 4)
  const singleFileConfigInfo = JSON.stringify(chatInstance?.singleFileConfig, null, 4)
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
        {renderSingleFileConfigInfo()}
        {renderGlobalConfigInfo()}
      </FlexColumn>
    </VSCodePanelView>
  </StyledVSCodePanels>
}

Settings.displayName = 'Settings'
