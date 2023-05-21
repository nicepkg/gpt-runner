import { useEffect, useState } from 'react'

export function useDebouncedState<S>(
  incoming: S,
  incomingTimeout: number | ((incoming: S) => number) = 5000,
  enabled = true,
) {
  const [state, setState] = useState<S>(incoming)

  const timeout
    = typeof incomingTimeout === 'function'
      ? incomingTimeout(incoming)
      : incomingTimeout

  useEffect(() => {
    if (!enabled)
      return

    let timeoutHandle: NodeJS.Timeout | null = null
    timeoutHandle = setTimeout(() => {
      setState(incoming)
      timeoutHandle = null
    }, timeout)

    return () => {
      if (timeoutHandle)
        clearTimeout(timeoutHandle)
    }
  }, [timeout, incoming, enabled])
  return state
}
