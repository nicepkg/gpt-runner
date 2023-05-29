import type { ClientEventData, ClientEventName } from '@nicepkg/gpt-runner-shared/common'
import { EventEmitter } from 'eventemitter3'
import { useEffect, useRef } from 'react'

if (!window.__emitter__)
  window.__emitter__ = new EventEmitter()

export const emitter = window.__emitter__

export function useEventEmitter() {
  const listenersRef = useRef<{
    [event in ClientEventName]?: (...args: any[]) => void;
  }>({})

  const on = <T extends ClientEventName>(
    event: T,
    listener: (arg: ClientEventData[T]) => void,
  ) => {
    listenersRef.current[event] = listener
    emitter.on(event, listener)
  }

  const once = <T extends ClientEventName>(
    event: T,
    listener: (arg: ClientEventData[T]) => void,
  ) => {
    listenersRef.current[event] = listener
    emitter.once(event, listener)
  }

  const off = <T extends ClientEventName>(
    event: T,
    listener: (arg: ClientEventData[T]) => void,
  ) => {
    delete listenersRef.current[event]
    emitter.off(event, listener)
  }

  const emit = <T extends ClientEventName>(event: T, arg: ClientEventData[T] extends void ? null : ClientEventData[T]) => {
    emitter.emit(event, arg)
  }

  useEffect(() => {
    return () => {
      Object.entries(listenersRef.current).forEach(([event, listener]) => {
        if (listener)
          emitter.off(event as ClientEventName, listener)
      })
    }
  }, [])

  return { on, once, off, emit }
}
