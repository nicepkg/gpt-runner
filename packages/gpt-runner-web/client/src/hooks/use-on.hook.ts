import type { ClientEventName, EventEmitterMap } from '@nicepkg/gpt-runner-shared/common'
import { useEffect } from 'react'
import { emitter } from '../helpers/emitter'

export interface UseOnProps<T extends ClientEventName> {
  eventName: T | T[]
  listener: EventEmitterMap[T]
  deps?: any[]
}

export function useOn<T extends ClientEventName>(props: UseOnProps<T>) {
  const { eventName, listener, deps = [] } = props

  useEffect(() => {
    const finalEventName = Array.isArray(eventName) ? eventName : [eventName]

    finalEventName.forEach((name) => {
      emitter.on(name, listener as any)
    })

    return () => {
      finalEventName.forEach((name) => {
        emitter.off(name, listener as any)
      })
    }
  }, deps)
}
