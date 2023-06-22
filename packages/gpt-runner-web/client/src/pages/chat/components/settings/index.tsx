import { type CSSProperties, type FC, useMemo, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { StyledVSCodePanels } from '../../chat.styles'
import { MessageCodeBlock } from '../../../../components/chat-message-code-block'
import { useGlobalStore } from '../../../../store/zustand/global'
import { useChatInstance } from '../../../../hooks/use-chat-instance.hook'
import { FlexColumn } from '../../../../styles/global.styles'
import { ConfigInfoTitle, ConfigInfoWrapper } from './settings.styles'
import { OpenaiSettings } from './components/openai-setting'

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
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.Settings)
  const { userConfig, getGptFileTreeItemFromChatId } = useGlobalStore()
  const { chatInstance } = useChatInstance({ chatId })

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
      <ConfigInfoTitle>Openai Config</ConfigInfoTitle>
      <OpenaiSettings></OpenaiSettings>
    </ConfigInfoWrapper>
  }

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        gptr.config.json
      </ConfigInfoTitle>
      <MessageCodeBlock language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderSingleFileConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        {gptFileName}
      </ConfigInfoTitle>
      <MessageCodeBlock language='json' contents={singleFileConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  if (!showSingleFileConfig)
    return renderGlobalConfigInfo()

  return <StyledVSCodePanels
    activeid={tabActiveId}
    style={viewStyle}
    onChange={(e: any) => {
      const activeId = e.target?.activeid as SettingsTabId
      setTabActiveId(activeId)
    }}
  >
    <VSCodePanelTab id={SettingsTabId.Settings}>Settings</VSCodePanelTab>
    <VSCodePanelTab id={SettingsTabId.ConfigInfo}>Config Info</VSCodePanelTab>

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
