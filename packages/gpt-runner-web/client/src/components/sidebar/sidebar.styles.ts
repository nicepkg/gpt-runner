import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 0.5rem;
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
`

export const SidebarSearch = styled(VSCodeTextField)`
  &::part(root) {
    border-radius: 0.25rem;
    overflow: hidden;
  }

  margin-bottom: 0.5rem;
`
