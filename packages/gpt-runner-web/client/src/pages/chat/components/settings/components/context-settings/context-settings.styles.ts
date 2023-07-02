import { VSCodeBadge, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const StyledBadge = styled(VSCodeBadge)`
  white-space: nowrap;
  margin: 0 0.25rem;
`

export const StyledVSCodeCheckbox = styled(VSCodeCheckbox)`
  margin-bottom: 0.5rem;
  flex: 1;

  &::part(control) {
    flex-shrink: 0;
  }
` as typeof VSCodeCheckbox

export const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`
