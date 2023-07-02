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
`

export const ConfigFormTitle = styled.div`
  padding-left: 0.5rem;
  margin: 1rem;
  margin-bottom: 0;
  font-size: 1rem;
  font-weight: bold;
  border-left: 0.25rem solid var(--foreground);
`
