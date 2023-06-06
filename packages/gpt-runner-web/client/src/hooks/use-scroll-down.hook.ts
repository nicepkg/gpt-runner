import type { RefObject } from 'react'
import { useCallback, useRef } from 'react'

interface UseScrollDownProps {
}

export function useScrollDown<Ref extends RefObject<any>>(_props: UseScrollDownProps = {}): [Ref, () => void, () => number] {
  const ref = useRef(null) as Ref

  const scrollDown = useCallback(() => {
    if (ref.current) {
      const elementHeight = ref.current.scrollHeight
      const visibleHeight = ref.current.clientHeight

      ref.current.scrollTop = (elementHeight - visibleHeight)
    }
  }, [ref.current])

  const getBottom = useCallback(() => {
    if (ref.current) {
      const elementHeight = ref.current.scrollHeight
      const scrollTop = ref.current.scrollTop
      const visibleHeight = ref.current.clientHeight

      return (elementHeight - visibleHeight - scrollTop)
    }

    return 0
  }, [ref.current])

  return [ref, scrollDown, getBottom]
}
