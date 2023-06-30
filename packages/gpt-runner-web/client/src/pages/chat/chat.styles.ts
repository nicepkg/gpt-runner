import { css, styled } from 'styled-components'
import { VSCodePanels } from '@vscode/webview-ui-toolkit/react'
import { withBreakpoint } from '../../helpers/with-breakpoint'

export const ContentWrapper = styled.div<{ $isPopoverContent: boolean }>`
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  ${withBreakpoint('sm', css`
    max-width: 100%;
    width: 100%;
  `)}

  ${props => props.$isPopoverContent && css`
    width: calc(100vw - 1rem);
    height: 100%;
    background: var(--panel-view-background);
    max-width: 500px;

    ${withBreakpoint('sm', css`
      min-width: min(calc(100vw - 1rem), 500px);
      width: min(calc(100vw - 1rem), 500px);
    `)}

    .tree-item__children {
      &::before {
        display: none;
      }
    }
  `}
`

export const StyledVSCodePanels = styled(VSCodePanels)`
  &::part(tablist) {
    padding-left: 1rem;
    padding-right: 1rem;
    width: auto;
    column-gap: 0;
  }

  &::part(tabpanel) {
    height: 100%;
    overflow: hidden;
  }

  &::part(activeIndicator) {
    width: 50%;
  }
` as typeof VSCodePanels

export const SidebarTopToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0;
  font-size: var(--type-ramp-base-font-size);
`

export const LeftSideWrapper = styled.div`
`

export const RightSideWrapper = styled.div`
`
