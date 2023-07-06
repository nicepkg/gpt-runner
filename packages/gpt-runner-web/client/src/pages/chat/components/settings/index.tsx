import { type CSSProperties, type FC, memo, useEffect, useMemo, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useTranslation } from 'react-i18next'
import { StyledVSCodePanels } from '../../chat.styles'
import { FormTitle } from '../../../../components/form-title'
import { useGlobalStore } from '../../../../store/zustand/global'
import { useConfetti } from '../../../../hooks/use-confetti.hook'
import { useElementVisible } from '../../../../hooks/use-element-visible.hook'
import { useUserConfig } from '../../../../hooks/use-user-config.hook'
import { LoadingView } from '../../../../components/loading-view'
import { ConfigInfoWrapper } from './settings.styles'
import { GeneralSettings } from './components/general-settings'
import { About } from './components/about'
import { ProxySettings } from './components/proxy-settings'
import { ModelSettings } from './components/model-settings'
import { ConfigInfo } from './components/config-info'

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
  const { getGptFileTreeItemFromChatId } = useGlobalStore()
  const { runConfettiAnime } = useConfetti()
  const [aboutRef, isAboutPageVisible] = useElementVisible<HTMLDivElement>()

  useEffect(() => {
    if (isAboutPageVisible)
      runConfettiAnime()
  }, [isAboutPageVisible])

  const gptFileTreeItem = useMemo(() => {
    if (!chatId)
      return null
    return getGptFileTreeItemFromChatId(chatId)
  }, [chatId, getGptFileTreeItemFromChatId])

  const { userConfig, singleFileConfig, isLoading: getGptFileInfoIsLoading } = useUserConfig({
    rootPath,
    singleFilePath: gptFileTreeItem?.path,
  })

  const viewStyle: CSSProperties = {
    height: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  const renderOverrideSetting = () => {
    return <ConfigInfoWrapper>
      <FormTitle size="large">
        {t('chat_page.settings_general')}
      </FormTitle>
      <GeneralSettings></GeneralSettings>
      <FormTitle size="large">
        {t('chat_page.settings_proxy')}
      </FormTitle>
      <ProxySettings></ProxySettings>
      <FormTitle size="large">
        <ModelSettings userConfig={userConfig} singleFileConfig={singleFileConfig} viewType='title'></ModelSettings>
        {` ${t('chat_page.settings_config')}`}
      </FormTitle>
      <ModelSettings userConfig={userConfig} singleFileConfig={singleFileConfig} viewType='secrets'></ModelSettings>
    </ConfigInfoWrapper>
  }

  const renderAbout = () => {
    return <About ref={aboutRef}></About>
  }

  const tabIdViewMap: Record<SettingsTabId, { title: string; view: JSX.Element }> = {
    [SettingsTabId.Settings]: {
      title: t('chat_page.settings_tab_settings'),
      view: renderOverrideSetting(),
    },
    [SettingsTabId.ConfigInfo]: {
      title: t('chat_page.settings_tab_config_info'),
      view: <>
        {getGptFileInfoIsLoading
          ? <LoadingView absolute></LoadingView>
          : <ConfigInfo
            userConfig={userConfig}
            singleFileConfig={singleFileConfig}
          ></ConfigInfo>}
      </>,
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
