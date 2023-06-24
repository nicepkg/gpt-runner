import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react'
import styled from 'styled-components'

export const StyledVSCodeDropdown = styled(VSCodeDropdown)`
  border-radius: 0.25rem;

  &::part(control) {
    border-radius: 0.25rem;
    overflow: hidden;
  }

  &::part(listbox) {
    margin-top: 0.25rem;
    border-radius: 0.25rem;
    padding-bottom: 0;
  }
`

export const StyledVSCodeOption = styled(VSCodeOption)`
  padding: 0.5rem;
  border: none
`
