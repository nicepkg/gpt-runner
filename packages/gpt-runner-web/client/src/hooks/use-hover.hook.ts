import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

export function useHover<Ref extends RefObject<any>>() {
  const [isHover, setIsHover] = useState(false)
  const isHoverRef = useRef(isHover)
  const ref = useRef(null) as Ref

  const handleMouseEnter = () => {
    isHoverRef.current = true
    setIsHover(true)
  }

  const handleMouseLeave = async () => {
    isHoverRef.current = false
    setIsHover(false)
  }

  useEffect(() => {
    const element = ref.current as HTMLElement
    if (!element)
      return

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref.current])

  return [ref, isHover, isHoverRef] as const
}
