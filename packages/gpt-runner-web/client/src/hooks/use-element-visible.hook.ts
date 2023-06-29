import { useLayoutEffect, useRef, useState } from 'react'

export interface UseElementVisibleProps<T = any> {
  ref?: React.RefObject<T>
}

export function useElementVisible<T = any>(props?: UseElementVisibleProps<T>): [ref: React.RefObject<T>, visible: boolean] {
  const { ref = useRef<any>(null) } = props || {}
  const [visible, setVisible] = useState(false)

  useLayoutEffect(() => {
    if (!ref.current)
      return

    const updateVisible = () => {
      if (ref.current)
        setVisible(ref.current.offsetParent !== null)
    }

    updateVisible()

    ref.current.addEventListener('resize', updateVisible)

    // ResizeObserver
    const resizeObserver = new ResizeObserver(updateVisible)
    resizeObserver.observe(ref.current)

    return () => {
      ref.current?.removeEventListener('resize', updateVisible)
      resizeObserver.disconnect()
    }
  }, [ref.current])

  return [ref, visible]
}
