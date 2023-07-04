import { type DependencyList, type EffectCallback, useEffect, useState } from 'react'

export interface UseOnceEffectProps {
  effect: EffectCallback
  deps?: DependencyList
  condition?: () => boolean
}
export function useOnceEffect(props: UseOnceEffectProps) {
  const { effect, deps = [], condition = () => true } = props
  const [hasRun, setHasRun] = useState(false)

  useEffect(() => {
    let returns: (() => void) | void = () => {}

    if (hasRun || !condition())
      return returns

    returns = effect()
    setHasRun(true)

    return returns
  }, deps)

  return hasRun
}
