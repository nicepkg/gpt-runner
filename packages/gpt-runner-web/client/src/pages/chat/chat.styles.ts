import { css, styled } from 'styled-components'
import { VSCodePanels } from '@vscode/webview-ui-toolkit/react'
import { withBreakpoint } from '../../helpers/with-breakpoint'

export const SidebarWrapper = styled.div`
  width: 100%;
  height: 100%;
  flex-shrink: 0;

  ${withBreakpoint('sm', css`
    max-width: 100%;
    width: 100%;
  `)}
`

export const StyledVSCodePanels = styled(VSCodePanels)`
  &::part(tablist) {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  &::part(tabpanel) {
    height: 100%;
    overflow: hidden;
  }
`

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
