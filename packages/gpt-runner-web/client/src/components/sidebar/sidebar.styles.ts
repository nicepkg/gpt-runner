import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 1rem;
  overflow: hidden;
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
`

export const SidebarSearchWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  align-items: center;
  height: var(--my-input-height);
`

export const SidebarSearch = styled(VSCodeTextField)`
  flex: 1;

  &::part(root) {
    border-radius: 0.25rem;
    overflow: hidden;
  }
`

export const SidebarSearchRightWrapper = styled.div`
  height: calc(100% - var(--border-width) * 1px * 2);
`

export const SidebarTreeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
`
