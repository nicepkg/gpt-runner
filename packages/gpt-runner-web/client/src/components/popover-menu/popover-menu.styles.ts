import styled from 'styled-components'
import { backDropBg } from '../../styles/utils'

export const MenuMask = styled.div`
  overflow: hidden;
  color: var(--foreground);
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0.5rem;
  border-bottom: 1px solid var(--panel-view-border);
  border-top: 1px solid var(--panel-view-border);
  flex-shrink: 0;
`

export const Menu = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--panel-view-border);
  border-radius: 0.5rem;
  overflow: hidden;
  ${backDropBg}
`

export const MenuChildrenWrapper = styled.div`
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;

  & > .icon-button {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
    border-top: 1px solid var(--panel-view-border);

    vscode-button {
      flex: 1;
      border-radius: 0 !important;

      &::part(content) {
        width: 100%;
      }
    }
  }

  & > .icon-button:first-child {
    border-top: none;
  }

  & > .popover-menu__menu-children {
    vscode-button {
      flex: 1;
      border-radius: 0 !important;

      &::part(content) {
        width: 100%;
      }
    }
  }
`

export const ChildrenWrapper = styled.div`
  overflow: hidden;
  flex-shrink: 0;

  & + .icon-button {
    padding-left: 0.5rem;
  }
`

export const Children = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  & > .icon-button {
    width: 100%;
  }
`
