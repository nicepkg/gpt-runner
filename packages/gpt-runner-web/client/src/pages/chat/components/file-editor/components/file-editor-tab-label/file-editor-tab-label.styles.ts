import { styled } from 'styled-components'
import { Icon } from '../../../../../../components/icon'

export const TabLabelWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 100%;
  font-size: var(--type-ramp-base-font-size);
  color: var(--foreground);
  background: var(--panel-view-background);
  cursor: pointer;
  user-select: none;
  padding: 0 0.25rem;
  min-width: max-content;
  width: 100%;

  &:hover {
    background: var(--panel-view-border);
  }
`

export const TabLabelLeft = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  flex-shrink: 0;
  margin-left: 0.25rem;
`

export const TabLabelCenter = styled(TabLabelLeft)<{ $fixed: boolean }>`
  flex-shrink: 1;
  flex: 1;
  font-style: ${({ $fixed }) => $fixed ? 'normal' : 'italic'};
`

export const TabLabelRight = styled(TabLabelLeft)`
  margin-left: 0;
`

export const StyledRightIcon = styled(Icon)`
  padding: 0.25rem;
  border-radius: 0.25rem;
  margin-left: 0.1rem;

  &:hover {
    background: var(--panel-view-border);
  }
`
