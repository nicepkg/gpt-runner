import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import styled from 'styled-components'

export const StyledVSCodeTextField = styled(VSCodeTextField)`
  &::part(root) {
    border-radius: 0.25rem;
    overflow: hidden;
  }

  &::part(label) {
    margin-bottom: 0.5rem;
  }
`
