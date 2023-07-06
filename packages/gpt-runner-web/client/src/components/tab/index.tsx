import type { CSSProperties, ReactNode } from 'react'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useMotionValue } from 'framer-motion'
import { useElementSizeRealTime } from '../../hooks/use-element-size-real-time.hook'
import { Icon } from '../icon'
import { useDebounceFn } from '../../hooks/use-debounce-fn.hook'
import { isElementVisible } from '../../helpers/utils'
import {
  ActiveTabIndicator,
  MoreIcon,
  MoreList,
  MoreListItem,
  MoreWrapper,
  TabContainer,
  TabItemLabel,
  TabItemWrapper,
  TabListHeader,
  TabListWrapper,
  TabView,
} from './tab.styles'

export interface TabItem<T extends string = string> {
  label: ReactNode
  id: T
  children?: ReactNode
  visible?: boolean
}

export interface TabProps<T extends string = string> {
  defaultActiveId?: T
  activeId?: T
  items: TabItem<T>[]
  style?: CSSProperties
  onChange?: (activeTabId: T) => void
}

export function Tab_<T extends string = string>(props: TabProps<T>) {
  const {
    defaultActiveId,
    activeId: activeIdFromProp,
    items = [],
    onChange: onChangeFromProp,
  } = props

  const DEFAULT_ACTIVE_ID = items[0].id
  const TAB_ID_ATTR = 'data-tab-id'
  const [activeIdFromPrivate, setActiveIdFromPrivate] = useState<T>()
  const [showMore, setShowMore] = useState(false)
  const [moreList, setMoreList] = useState<TabItem<T>[]>([])
  const [moreListVisible, setMoreListVisible] = useState(false)
  const [tabRef, tabSize] = useElementSizeRealTime<HTMLDivElement>()

  // motion
  const indicatorWidth = useMotionValue(0)
  const indicatorLeft = useMotionValue(0)

  const activeId = useMemo(() => {
    return activeIdFromProp ?? activeIdFromPrivate ?? defaultActiveId ?? DEFAULT_ACTIVE_ID
  }, [activeIdFromProp, activeIdFromPrivate, defaultActiveId])

  const setActiveId = useCallback((id: T) => {
    onChangeFromProp ? onChangeFromProp(id) : setActiveIdFromPrivate(id)
  }, [onChangeFromProp])

  const tabIdTabItemMap = useMemo(() => {
    const map = {} as Record<T, TabItem<T>>

    items.forEach((item) => {
      map[item.id] = item
    })
    return map
  }, [items])

  const getTabItemById = useCallback((id: T): TabItem<T> | undefined => {
    return tabIdTabItemMap[id]
  }, [tabIdTabItemMap])

  const getLabelDoms = useCallback(() => {
    return Array.from(tabRef.current?.querySelectorAll(`[${TAB_ID_ATTR}]`) || []) as HTMLElement[]
  }, [tabRef.current, items])

  const getActiveLabelDom = useCallback(() => {
    return tabRef.current?.querySelector<HTMLElement>(`[${TAB_ID_ATTR}="${activeId}"]`) ?? null
  }, [tabRef.current, activeId])

  const handleTabItemClick = useCallback((item: TabItem<T>) => {
    setActiveId(item.id)
    setMoreListVisible(false)
  }, [setActiveId, setMoreListVisible])

  const calcTabChildrenWidth = useCallback(() => {
    const labelDoms = getLabelDoms()

    if (!labelDoms.length)
      return 0

    const tabsWidth = labelDoms.reduce((acc, cur) => {
      return acc + cur.offsetWidth
    }, 0)

    return tabsWidth
  }, [getLabelDoms])

  useEffect(() => {
    const activeLabelDom = getActiveLabelDom()

    if (!activeLabelDom)
      return

    activeLabelDom.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [getActiveLabelDom, tabSize.width])

  // let it scroll when mouse wheel on tab list
  const handleTabListScroll = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
    const tabListWrapper = event.currentTarget
    const scrollAmount = event.deltaY

    tabListWrapper.scrollLeft += scrollAmount
  }, [])

  const updateMoreList = useCallback(() => {
    const labelDoms = getLabelDoms()
    const _moreList: TabItem<T>[] = []

    Array.from(labelDoms).forEach((item) => {
      const tabId = item.getAttribute(TAB_ID_ATTR) as T
      const tabItem = getTabItemById(tabId)
      const isVisible = isElementVisible(item, item.parentElement!, 0.6)

      if (!tabItem)
        return

      _moreList.push({
        ...tabItem,
        visible: isVisible,
      })
    })

    setMoreList(_moreList)
  }, [getLabelDoms, setMoreList, getTabItemById])

  const debounceUpdateMoreList = useDebounceFn(updateMoreList)

  const updateIndicatorPosition = useCallback(() => {
    const activeLabelDom = getActiveLabelDom()

    if (!activeLabelDom)
      return

    const { offsetLeft, offsetWidth } = activeLabelDom

    indicatorWidth.set(offsetWidth)
    indicatorLeft.set(offsetLeft)
    debounceUpdateMoreList()
  }, [getActiveLabelDom, debounceUpdateMoreList])

  useEffect(() => {
    updateIndicatorPosition()
  }, [updateIndicatorPosition, tabSize.width])

  useEffect(() => {
    const tabsTotalWidth = calcTabChildrenWidth()
    setShowMore(tabsTotalWidth > tabSize.width)
    updateMoreList()
  }, [calcTabChildrenWidth, setShowMore, updateMoreList, tabSize.width])

  return (
    <TabContainer>
      <TabListHeader data-show-more={showMore}>
        <TabListWrapper ref={tabRef} data-show-more={showMore} onWheel={handleTabListScroll}>
          {items.map(item => (
            <div {...{
              key: item.id,
              [TAB_ID_ATTR]: item.id,
            }}>
              <TabItemWrapper onClick={() => handleTabItemClick(item)}>
                <TabItemLabel
                  className={activeId === item.id ? 'tab-item-active' : ''}
                  tabIndex={activeId === item.id ? 0 : -1}
                >
                  {item.label}
                </TabItemLabel>
              </TabItemWrapper>
            </div>
          ))}

          <ActiveTabIndicator
            style={{
              width: indicatorWidth,
              x: indicatorLeft,
            }}
          />
        </TabListWrapper>

        {showMore && (
          <MoreWrapper>
            <MoreIcon onClick={() => setMoreListVisible(!moreListVisible)}>
              <Icon className="codicon-more" />
            </MoreIcon>
            {moreListVisible && (
              <MoreList>
                {moreList.map(item => (
                  !item.visible && <MoreListItem key={item.id} onClick={() => handleTabItemClick(item)}>
                    {item.label}
                  </MoreListItem>
                ))}
              </MoreList>
            )}
          </MoreWrapper>
        )}
      </TabListHeader>

      {items.map((item) => {
        return (
          <TabView key={item.id} style={{
            display: activeId === item.id ? 'flex' : 'none',
          }}>
            {item.children}
          </TabView>
        )
      })}

    </TabContainer>
  )
}

Tab_.displayName = 'Tab'

export const Tab = memo(Tab_) as typeof Tab_
