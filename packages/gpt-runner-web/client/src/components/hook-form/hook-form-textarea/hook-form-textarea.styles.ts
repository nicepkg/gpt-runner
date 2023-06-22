import { VSCodeTextArea } from '@vscode/webview-ui-toolkit/react'
import styled from 'styled-components'

export const StyledVSCodeTextArea = styled(VSCodeTextArea)`
  &::part(control) {
    border-radius: 0.25rem;
    overflow: hidden;
  }

  &::part(label) {
    margin-bottom: 0.5rem;
  }
`
