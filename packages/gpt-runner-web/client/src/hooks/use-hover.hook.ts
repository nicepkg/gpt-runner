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

export function useHoverByMouseLocation<Ref extends RefObject<any>>() {
  const [isHover, setIsHover] = useState(false)
  const isHoverRef = useRef(isHover)
  const ref = useRef(null) as Ref
  const [mouseLocation, setMouseLocation] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const refBoundRect = ref.current?.getBoundingClientRect()

    if (!ref.current || (refBoundRect.height === 0 && refBoundRect.width === 0)) {
      isHoverRef.current = false
      setIsHover(false)
      return
    }

    const isHover = mouseLocation.x >= refBoundRect.x
    && mouseLocation.x <= refBoundRect.x + refBoundRect.width
    && mouseLocation.y >= refBoundRect.y
    && mouseLocation.y <= refBoundRect.y + refBoundRect.height

    isHoverRef.current = isHover
    setIsHover(isHover)
  }, [ref, mouseLocation.x, mouseLocation.y])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouseLocation({ x: e.clientX, y: e.clientY })
    }

    // fix mouse leave not triggered when mouse leave window
    const handleMouseLeave = () => {
      setMouseLocation({ x: -1, y: -1 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return [ref as Ref, isHover, isHoverRef] as const
}
