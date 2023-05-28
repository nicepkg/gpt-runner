import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export function useHover<Ref extends RefObject<any>>(): [Ref, boolean] {
  const [isHover, setIsHover] = useState(false)
  const ref = useRef(null) as Ref

  const handleMouseEnter = (): void => {
    setIsHover(true)
  }

  const handleMouseLeave = (): void => {
    setIsHover(false)
  }

  useEffect(() => {
    const element = ref.current

    if (element) {
      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (element) {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [ref])

  return [ref, isHover]
}
