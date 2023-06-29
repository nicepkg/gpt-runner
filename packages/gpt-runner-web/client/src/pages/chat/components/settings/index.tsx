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
import { useConfetti } from '../../../../hooks/use-confetti.hook'
import { ConfigInfoTitle, ConfigInfoWrapper } from './settings.styles'
import { OpenaiSettings } from './components/openai-settings'
import { GeneralSettings } from './components/general-settings'
import { About } from './components/about'
import { ProxySettings } from './components/proxy-settings'

export enum SettingsTabId {
  About = 'about',
  ConfigInfo = 'configInfo',
  Settings = 'settings',
}

export interface SettingsProps {
  rootPath: string
  chatId?: string
  onlyRenderTabId?: SettingsTabId
}

export const Settings: FC<SettingsProps> = memo((props) => {
  const { rootPath, chatId, onlyRenderTabId } = props

  const { t } = useTranslation()
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.Settings)
  const { themeName, getGptFileTreeItemFromChatId } = useGlobalStore()
  const { runConfettiAnime } = useConfetti()
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
      <ConfigInfoTitle>{t('chat_page.settings_proxy')}</ConfigInfoTitle>
      <ProxySettings></ProxySettings>
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

  const renderAbout = () => {
    return <About></About>
  }

  const tabIdViewMap: Record<SettingsTabId, { title: string; view: JSX.Element }> = {
    [SettingsTabId.Settings]: {
      title: t('chat_page.settings_tab_settings'),
      view: renderOverrideSetting(),
    },
    [SettingsTabId.ConfigInfo]: {
      title: t('chat_page.settings_tab_config_info'),
      view: <FlexColumn style={{ width: '100%' }}>
        {getGptFileInfoIsLoading && <LoadingView absolute></LoadingView>}

        {renderSingleFileConfigInfo()}
        {renderGlobalConfigInfo()}
      </FlexColumn>,
    },
    [SettingsTabId.About]: {
      title: t('chat_page.settings_tab_about'),
      view: renderAbout(),
    },
  }

  const onlyRenderTabView = tabIdViewMap[onlyRenderTabId!]?.view

  if (onlyRenderTabView)
    return onlyRenderTabView

  return <StyledVSCodePanels
    activeid={tabActiveId}
    style={viewStyle}
    onChange={(e: any) => {
      const activeId = e.target?.activeid as SettingsTabId
      setTabActiveId(activeId)
      activeId === SettingsTabId.About && runConfettiAnime()
    }}
  >
    {Object.entries(tabIdViewMap).map(([tabId, { title }]) => {
      return <VSCodePanelTab id={tabId} key={tabId}>{title}</VSCodePanelTab>
    })}

    {Object.entries(tabIdViewMap).map(([tabId, { view }]) => {
      return <VSCodePanelView style={viewStyle} id={tabId} key={tabId}>
        {view}
      </VSCodePanelView>
    })}

  </StyledVSCodePanels>
})

Settings.displayName = 'Settings'
