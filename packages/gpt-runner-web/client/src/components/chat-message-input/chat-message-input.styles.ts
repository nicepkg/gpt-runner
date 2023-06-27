import { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'
import { Logo } from '../logo'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  padding: 0.5rem;
  border-top: 1px solid var(--panel-view-border);
`

export const ToolbarWrapper = styled.div`
position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
`

export const TextAreaWrapper = styled.div`
  position: relative;
  margin-top: 0.5rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
`

export const StyledVSCodeTextArea = styled(VSCodeTextArea)`
  width: 100%;
  height: 100%;

  &::part(control) {
    border-radius: 0.25rem;
    height: 100%;
  }
`

export const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 1.5rem;
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
`

export const StyledLogo = styled(Logo)`
  height: 100%;
  opacity: 1;
`
