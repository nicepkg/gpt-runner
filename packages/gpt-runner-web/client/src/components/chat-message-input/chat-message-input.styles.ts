import { styled } from 'styled-components'
import { Logo } from '../logo'
import { backDropBg } from '../../styles/utils'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  padding: 0.5rem;
  border-top: 1px solid var(--panel-view-border);
  ${backDropBg}
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

  .chat-input-editor {
    border: 1px solid var(--panel-view-border);
    border-radius: 0.25rem;
    overflow: hidden;

    &:hover {
      border-color: var(--focus-border);
    }

    .monaco-editor {
      background-color: transparent !important;

      .margin {
        background-color: transparent !important;
      }
    }

    .monaco-editor-background {
      background-color: transparent !important;
    }
  }
`

export const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 1.5rem;
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  pointer-events: none;
`

export const StyledLogo = styled(Logo)`
  width: auto;
  height: 100%;
  opacity: 1;
  cursor: pointer;
  pointer-events: all;
`
