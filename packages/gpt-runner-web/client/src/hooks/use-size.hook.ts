import { useEffect, useRef, useState } from 'react'

interface Size {
  width: number
  height: number
}

interface UseSizeProps {
  ref?: React.RefObject<HTMLElement>
  width?: number
  height?: number
}

export function useSize(props?: UseSizeProps): [ref: React.RefObject<HTMLElement>, size: Size] {
  const { width = 0, height = 0 } = props || {}

  const ref = props?.ref ?? useRef<HTMLElement>(null)
  const [size, setSize] = useState<Size>({ width, height })

  useEffect(() => {
    if (!ref.current)
      return

    const updateSize = () => {
      if (ref.current) {
        console.log('updateSize', ref.current.offsetWidth, ref.current.offsetHeight)
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        })
      }
    }

    updateSize()

    ref.current.addEventListener('resize', updateSize)

    return () => {
      ref.current?.removeEventListener('resize', updateSize)
    }
  }, [ref.current])

  return [ref, size]
}
