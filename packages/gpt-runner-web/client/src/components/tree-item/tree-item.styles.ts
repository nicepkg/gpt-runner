import { styled } from 'styled-components'
import { textEllipsis } from '../../styles/utils'

export const TreeItemWrapper = styled.div`
`

export const TreeItemRow = styled.div<{ $isFocused: boolean }>`
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  font-size: var(--type-ramp-plus1-font-size);
  padding: 0.25rem 0.25rem 0.25rem 0;

  ${({ $isFocused }) => ($isFocused
? `
  color: var(--list-active-selection-foreground);
  background: var(--list-active-selection-background);
  `
: '')}

  &:hover {
    background: var(--list-hover-background);
  }

  &:focus {
    outline: none;
    background: var(--list-active-selection-background);
  }
`

export const TreeItemRowLeftSlot = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  ${textEllipsis}
`
export const IconWrapper = styled.div`
  height: fit-content;
  overflow: hidden;
  display: flex;
`

export const NameWrapper = styled.div`
  font-size: var(--type-ramp-base-font-size);
`
export const TreeItemRowRightSlot = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const Children = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: var(--type-ramp-plus1-font-size);
  border-left:  1px solid var(--panel-view-border);
  border-radius: var(--corner-radius);
`
