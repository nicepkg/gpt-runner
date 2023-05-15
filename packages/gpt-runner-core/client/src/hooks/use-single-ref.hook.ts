import { useRef } from 'react'

export function useSingleRef<T>(factory: () => T) {
  const ref = useRef<T>()
  if (typeof ref.current === 'undefined')
    ref.current = factory()

  return ref.current
}
