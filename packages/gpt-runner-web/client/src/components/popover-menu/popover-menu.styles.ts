import styled from 'styled-components'

export const MenuMask = styled.div`
  overflow: hidden;
`

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--list-hover-background);
  border: 1px solid var(--panel-view-border);
  border-radius: 0.5rem;
  overflow: hidden;

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
