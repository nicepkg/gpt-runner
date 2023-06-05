import type { RefObject } from 'react'
import { useCallback, useRef } from 'react'

interface UseScrollDownOptions {
  percentageThreshold?: number
}

export function useScrollDown<Ref extends RefObject<any>>({
  percentageThreshold = 100,
}: UseScrollDownOptions = {}): [Ref, () => void] {
  const ref = useRef(null) as Ref

  const scrollDown = useCallback(() => {
    if (ref.current) {
      const elementHeight = ref.current.scrollHeight
      const scrollTop = ref.current.scrollTop
      const visibleHeight = ref.current.clientHeight

      const scrollPercentage = (scrollTop / (elementHeight - visibleHeight)) * 100

      if (scrollPercentage <= percentageThreshold)
        ref.current.scrollTop = (percentageThreshold / 100) * (elementHeight - visibleHeight)
    }
  }, [percentageThreshold, ref.current])

  return [ref, scrollDown]
}
