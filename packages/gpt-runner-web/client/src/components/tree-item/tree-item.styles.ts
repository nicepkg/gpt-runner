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
  margin: 0.25rem 0 0.25rem 0;
  height: var(--my-button-height);
  border-radius: 0.25rem;

  ${({ $isFocused }) => ($isFocused
? `
  background: var(--list-hover-background);
  `
: '')}

  &:hover {
    background: var(--list-hover-background);
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
  flex-shrink: 0;
`

export const NameWrapper = styled.div`
  flex: 1;
  font-size: var(--type-ramp-base-font-size);
  ${textEllipsis}
`
export const TreeItemRowRightSlot = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 0.5rem;
  ${textEllipsis}
`

export const Children = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: var(--type-ramp-plus1-font-size);
  border-radius: var(--corner-radius);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    opacity: 0.5;
    border-left:  1px solid var(--panel-view-border);
  }
`
