import { styled } from 'styled-components'

export const SelectOptionList = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  color: var(--foreground);
  background: var(--panel-view-background);
  max-width: 100%;
 `

export const SelectOptionItem = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  cursor: pointer;
  user-select: none;
  font-size: var(--type-ramp-base-font-size);
  border-bottom: 1px solid var(--panel-view-border);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: var(--button-secondary-foreground);
    background: var(--button-secondary-hover-background);
    border-bottom-color: transparent;
  }

  &[data-selected=true] {
    color: var(--button-secondary-foreground);
    background: var(--button-secondary-background);
    border-bottom-color: transparent;
  }
`
