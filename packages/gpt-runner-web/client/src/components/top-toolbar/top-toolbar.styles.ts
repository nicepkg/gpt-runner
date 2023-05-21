import { styled } from 'styled-components'
import { textEllipsis } from '../../styles/utils'

export const TopToolbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  color: var(--foreground);

  ${textEllipsis}
`

export const TopToolbarRightSlot = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`

export const IconWrapper = styled.div`
  cursor: pointer;
  display: flex;
  margin-left: var(--design-unit);
  color: var(--foreground);
`
