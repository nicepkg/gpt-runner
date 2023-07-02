import { useCallback, useEffect, useRef } from 'react'

type Procedure = (...args: any[]) => void

interface DebounceOptions {
  delay?: number
  leading?: boolean
}

export function useDebounceFn<F extends Procedure>(
  fn: F,
  options: DebounceOptions = {},
): F {
  const { delay = 300, leading = false } = options
  const fnRef = useRef(fn)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const debouncedFn = useCallback<F>(
    ((...args: any[]) => {
      const callNow = leading && timerRef.current === null
      cancel()

      timerRef.current = window.setTimeout(() => {
        if (!callNow)
          fnRef.current(...args)

        timerRef.current = null
      }, delay)

      if (callNow)
        fnRef.current(...args)
    }) as F,
    [delay, leading, cancel],
  )

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return debouncedFn
}
