import { useEffect, useRef } from 'react'
import { emitter } from '../helpers/emitter'

export interface UseEventEmitterReturns {
  emit: typeof emitter.emit
  on: typeof emitter.on
  once: typeof emitter.once
  off: typeof emitter.off
}

export function useEventEmitter(): UseEventEmitterReturns {
  const listenersRef = useRef<Record<string, (...args: any[]) => void>>({})

  const on = (
    eventName: string,
    listener: (...args: any[]) => void,
  ) => {
    listenersRef.current[eventName] = listener
    emitter.on(eventName as any, listener)
  }

  const once = (
    eventName: string,
    listener: (...args: any[]) => void,
  ) => {
    listenersRef.current[eventName] = listener
    emitter.once(eventName as any, listener)
  }

  const off = (
    eventName: string,
    listener: (...args: any[]) => void,
  ) => {
    delete listenersRef.current[eventName]
    emitter.off(eventName as any, listener)
  }

  const emit = (eventName: string, ...args: any[]) => {
    emitter.emit(eventName as any, ...args)
  }

  useEffect(() => {
    return () => {
      Object.entries(listenersRef.current).forEach(([eventName, listener]) => {
        if (listener)
          emitter.off(eventName as any, listener)
      })
    }
  }, [])

  return { on, once, off, emit } as UseEventEmitterReturns
}
