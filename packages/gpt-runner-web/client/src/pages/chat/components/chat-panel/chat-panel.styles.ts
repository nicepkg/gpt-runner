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
  & .sidebar-wrapper {
    width: calc(100vw - 2rem);
    height: 50vh;
    background: var(--panel-view-background);
    padding-bottom: 0.5rem;
    max-width: 500px;

    .tree-item__children {
      &::before {
        display: none;
      }
    }
  }
`
