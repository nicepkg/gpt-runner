import { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 250px;
  width: 100%;
  flex-shrink: 0;
  padding: 0.5rem;
  border-top: 1px solid var(--panel-view-border);
`

export const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`

export const StyledVSCodeTextArea = styled(VSCodeTextArea)`
  margin-top: 0.5rem;
  overflow: hidden;

  &::part(control) {
    border-radius: 0.25rem;
  }
`
