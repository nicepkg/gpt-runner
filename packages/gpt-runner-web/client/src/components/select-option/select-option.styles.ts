import { styled } from 'styled-components'

export const SelectOptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  color: var(--foreground);
  background: var(--panel-view-background);
 `

export const SelectOptionItem = styled.div`
  padding: 0.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: var(--type-ramp-base-font-size);
  border-bottom: 1px solid var(--panel-view-border);

  &:hover {
    color: var(--button-primary-foreground);
    background: var(--button-primary-hover-background);
    border-bottom-color: transparent;
  }

  &[data-selected=true] {
    color: var(--button-primary-foreground);
    background: var(--button-primary-background);
    border-bottom-color: transparent;
  }
`
