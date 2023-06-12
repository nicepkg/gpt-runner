import styled from 'styled-components'

export const Menu = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--list-hover-background);
  border: 1px solid var(--panel-view-border);
  border-radius: 0.25rem;
  overflow: hidden;

  & > .icon-button {
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
    border-top: 1px solid var(--panel-view-border);
  }

  & > .icon-button:first-child {
    border-top: none;
  }

  & vscode-button {
    flex: 1;
    border-radius: 0 !important;

    &::part(content) {
      width: 100%;
    }
  }
`
export const ChildrenWrapper = styled.div`
  overflow: hidden;

  & + .icon-button {
    padding-left: 0.5rem;
  }
`

export const Children = styled.div`
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  & > .icon-button {
    width: 100%;
  }
`
