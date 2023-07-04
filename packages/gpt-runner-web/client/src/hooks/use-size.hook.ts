import { useLayoutEffect, useRef, useState } from 'react'

interface Size {
  width: number
  height: number
}

interface UseSizeProps<T extends HTMLElement = HTMLElement> {
  ref?: React.RefObject<T>
  width?: number
  height?: number
}

export function useSize<T extends HTMLElement = HTMLElement>(props?: UseSizeProps<T>): [ref: React.RefObject<T>, size: Size] {
  const { width = 0, height = 0 } = props || {}

  const ref = props?.ref ?? useRef<T>(null)
  const [size, setSize] = useState<Size>({ width, height })

  useLayoutEffect(() => {
    if (!ref.current)
      return

    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        })
      }
    }

    updateSize()

    ref.current.addEventListener('resize', updateSize)

    // ResizeObserver
    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(ref.current)

    return () => {
      ref.current?.removeEventListener('resize', updateSize)
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return [ref, size]
}
