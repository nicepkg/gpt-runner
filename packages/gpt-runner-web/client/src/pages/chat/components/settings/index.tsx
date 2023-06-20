import { type CSSProperties, type FC, useMemo, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { StyledVSCodePanels } from '../../chat.styles'
import { MessageCodeBlock } from '../../../../components/chat-message-code-block'
import { useGlobalStore } from '../../../../store/zustand/global'
import { useChatInstance } from '../../../../hooks/use-chat-instance.hook'
import { ConfigInfoTitle, ConfigInfoWrapper } from './settings.styles'

enum SettingsTabId {
  Global = 'global',
  SingleFile = 'single-file',
  Override = 'override',
}

export interface SettingsProps {
  showSingleFileConfig?: boolean
  chatId?: string
}

export const Settings: FC<SettingsProps> = (props) => {
  const { showSingleFileConfig, chatId } = props
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.Override)
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

  const infoTitle = 'This is parse result. it\'s readonly:'
  const globalConfigInfo = JSON.stringify(userConfig, null, 4)
  const singleFileConfigInfo = JSON.stringify(chatInstance?.singleFileConfig, null, 4)
  const gptFileName = gptFileTreeItem?.path.split('/').pop()

  const renderOverrideSetting = () => {
    return <div>aaa</div>
  }

  const renderGlobalConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        {infoTitle}
      </ConfigInfoTitle>
      <MessageCodeBlock language='json' contents={globalConfigInfo}></MessageCodeBlock>
    </ConfigInfoWrapper>
  }

  const renderSingleFileConfigInfo = () => {
    return <ConfigInfoWrapper>
      <ConfigInfoTitle>
        {infoTitle}
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
    <VSCodePanelTab id={SettingsTabId.Override}>override setting</VSCodePanelTab>
    <VSCodePanelTab id={SettingsTabId.SingleFile}>{gptFileName}</VSCodePanelTab>
    <VSCodePanelTab id={SettingsTabId.Global}>gptr.config.json</VSCodePanelTab>

    <VSCodePanelView style={viewStyle} id={SettingsTabId.Override}>
      {renderOverrideSetting()}
    </VSCodePanelView>
    <VSCodePanelView style={viewStyle} id={SettingsTabId.SingleFile}>
      {renderSingleFileConfigInfo()}
    </VSCodePanelView>
    <VSCodePanelView style={viewStyle} id={SettingsTabId.Global}>
      {renderGlobalConfigInfo()}
    </VSCodePanelView>
  </StyledVSCodePanels>
}

Settings.displayName = 'Settings'
