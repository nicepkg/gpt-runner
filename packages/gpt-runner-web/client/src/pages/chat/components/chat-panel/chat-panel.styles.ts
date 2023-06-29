import { css, styled } from 'styled-components'
import { withBreakpoint } from '../../../../helpers/with-breakpoint'

export const ChatPanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  max-height: 100%;
  overflow-x: hidden;
  overflow-y: auto;

  ${withBreakpoint('sm', css`
    border-left: none;
  `)}
`

export const ChatPanelPopoverTreeWrapper = styled.div`
  height: 100%;

  & .sidebar-wrapper {
    flex-direction: column-reverse;
  }
`
