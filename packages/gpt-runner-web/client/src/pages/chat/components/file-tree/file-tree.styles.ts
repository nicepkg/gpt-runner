import { VSCodeBadge } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const FileTreeItemRightWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: var(--type-ramp-base-font-size);
  color: var(--panel-view-border);
`

export const FileTreeSidebarUnderSearchWrapper = styled.div`
  font-size: var(--type-ramp-base-font-size);
  margin:  0.25rem 0 0.5rem 0;
  background: linear-gradient(-135deg, var(--list-hover-background) 10%, transparent 70%);
  color: var(--input-foreground);
  padding: 0.5rem 0;
  border-radius: 0.25rem;
`

export const FileTreeSidebarHighlight = styled(VSCodeBadge)`
  white-space: nowrap;
  margin: 0 0.25rem;
`
