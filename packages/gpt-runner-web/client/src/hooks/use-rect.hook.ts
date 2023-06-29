import { useLayoutEffect, useRef, useState } from 'react'

export interface UseRectProps {
  ref?: React.RefObject<HTMLElement>
}

export function useRect(props?: UseRectProps): [ref: React.RefObject<any>, rect: DOMRect] {
  const ref = props?.ref ?? useRef<HTMLElement>(null)
  const [rect, setRect] = useState<DOMRect>(new DOMRect())

  useLayoutEffect(() => {
    if (!ref.current)
      return

    const updateRect = () => {
      if (ref.current)
        setRect(ref.current.getBoundingClientRect())
    }

    updateRect()

    ref.current.addEventListener('resize', updateRect)

    // ResizeObserver
    const resizeObserver = new ResizeObserver(updateRect)
    resizeObserver.observe(ref.current)

    return () => {
      ref.current?.removeEventListener('resize', updateRect)
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return [ref, rect]
}
