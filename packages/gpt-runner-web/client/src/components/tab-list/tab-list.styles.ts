import styled from 'styled-components'

export const TabContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

export const TabListHeader = styled.div<{ $showMore: boolean }>`
  flex-shrink: 0;
  position: relative;
  padding: calc(var(--border-width) * 3px) 1rem;

  ${({ $showMore }) => $showMore ? 'padding-right: calc(var(--type-ramp-minus1-font-size) * 2 + 1rem)' : ''}
`

export const TabListWrapper = styled.div<{ $showMore: boolean }>`
  display: flex;
  overflow-x: auto;
  position: relative;

  justify-content: ${({ $showMore }) => $showMore ? 'flex-start' : 'space-evenly'};

  /* hide scroll bar style */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`

export const TabItemWrapper = styled.div`
  flex: 1;
  display: flex;
`

export const TabItem = styled.div`
  white-space: nowrap;
  flex: 1;
  padding: 0 var(--type-ramp-base-font-size);
  height: calc(var(--design-unit) * 7px);
  line-height: calc(var(--design-unit) * 7px);
  text-align: center;
  color: var(--panel-tab-foreground);
  font-size: var(--type-ramp-base-font-size);
  cursor: pointer;

  &.active {
    color: var(--panel-tab-active-foreground);
  }
`

export const ActivedTabIndicator = styled.div<{
  width: number
  left: number
}>`
  width: ${props => props.width}px;
  height: 1px;
  background-color: var(--panel-tab-active-foreground);

  position: absolute;
  left: 0;
  bottom: 0;
  transform: translateX(${props => props.left}px);
  transition: transform 0.2s ease-in-out;
`

export const MoreWrapper = styled.div`
  height: 100%;
  padding: 0 var(--type-ramp-minus1-font-size);
  background-color: var(--panel-view-background);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const MoreIcon = styled.div`
  display: inline-block;
`

export const MoreList = styled.div`
  min-width: var(--input-min-width);
  padding: 1rem var(--type-ramp-minus1-font-size);
  padding-bottom: 0;
  position: absolute;
  z-index: 3;
  top: 33px;
  right: 2px;
  background-color: var(--panel-view-background);
  box-shadow: 0 6px 16px 0 rgba(0, 0, 0, .08), 0 3px 6px -4px rgba(0, 0, 0, .12), 0 9px 28px 8px rgba(0, 0, 0, .05);
  border-radius: 0.5rem;
`

export const MoreListItem = styled.div`
  text-align: center;
  color: var(--panel-tab-foreground);
  font-size: var(--type-ramp-base-font-size);
  margin-bottom: 1rem;
`

export const TabView = styled.div`
  display: flex;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
`
