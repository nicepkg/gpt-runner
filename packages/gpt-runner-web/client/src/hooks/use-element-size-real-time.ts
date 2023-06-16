import { useCallback, useMemo, useRef, useState } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

export interface ElementSize {
  width: number
  height: number
}

export type UseElementSizeResult<E extends Element = Element> = [
  React.MutableRefObject<E | null>,
  ElementSize,
]

const defaultState: ElementSize = {
  width: 0,
  height: 0,
}

export function useElementSizeRealTime<
  E extends Element = Element,
>(): UseElementSizeResult<E> {
  const elementRef = useRef<E | null>(null)
  const [size, setSize] = useState<ElementSize>(defaultState)

  const updateSize = useCallback(() => {
    if (elementRef.current) {
      const { width, height } = elementRef.current.getBoundingClientRect()
      setSize({ width, height })
    }
  }, [])

  const observer = useMemo(
    () =>
      new window.ResizeObserver(() => {
        updateSize()
      }),
    [],
  )

  useIsomorphicLayoutEffect(() => {
    if (!elementRef.current)
      return
    observer.observe(elementRef.current)
    return () => {
      observer.disconnect()
    }
  }, [elementRef.current])

  return [elementRef, size]
}
