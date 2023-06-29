import { styled } from 'styled-components'

const toolbarHeight = 'calc(var(--my-button-height) + 0.5rem)'

export const TopToolbarWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: ${toolbarHeight};
  align-items: center;
  background-color: var(--panel-view-background);
  border-bottom: 1px solid var(--panel-view-border);
`

export const TopToolbarBlank = styled.div`
  flex-shrink: 0;
  width: 100%;
  height: ${toolbarHeight};
`
