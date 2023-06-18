import { type CSSProperties, type FC, useState } from 'react'
import { VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { StyledVSCodePanels } from '../../chat.styles'

enum SettingsTabId {
  Global = 'global',
  SingleFile = 'single-file',
}

export interface SettingsProps {
  showSingleFileConfig?: boolean
}

export const Settings: FC<SettingsProps> = (props) => {
  const { showSingleFileConfig } = props
  const [tabActiveId, setTabActiveId] = useState(SettingsTabId.SingleFile)

  const viewStyle: CSSProperties = {
    height: '100%',
    maxHeight: '100%',
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  if (!showSingleFileConfig)
    return <> global config</>

  return <StyledVSCodePanels
    activeid={tabActiveId}
    style={viewStyle}
    onChange={(e: any) => {
      const activeId = e.target?.activeid as SettingsTabId
      setTabActiveId(activeId)
    }}
  >
    <VSCodePanelTab id={SettingsTabId.SingleFile}>GPT File Config</VSCodePanelTab>
    <VSCodePanelTab id={SettingsTabId.Global}>Global Config</VSCodePanelTab>
    <VSCodePanelView style={viewStyle} id={SettingsTabId.SingleFile}>
      single file config
    </VSCodePanelView>
    <VSCodePanelView style={viewStyle} id={SettingsTabId.Global}>
      global config
    </VSCodePanelView>
  </StyledVSCodePanels>
}

Settings.displayName = 'Settings'
