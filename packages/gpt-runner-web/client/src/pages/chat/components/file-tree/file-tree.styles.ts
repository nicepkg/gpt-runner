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
  color: var(--input-foreground);
  margin-bottom: 1rem;

  & ::part(control) {
    flex-shrink: 0;
  }
`

export const FileTreeSidebarHighlight = styled(VSCodeBadge)`
  white-space: nowrap;
  margin: 0 0.25rem;
`

export const FilterWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.5rem;
  padding: 0.5rem;
`
