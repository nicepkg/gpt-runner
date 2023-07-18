// useKeyboard.ts
import { useEffect, useState } from 'react'
import type { Callback } from 'keyboardjs'
import keyboardjs from 'keyboardjs'

export function useKeyboard<T extends string | string[]>(key: T, onPress: Callback, onRelease?: Callback): void {
  useEffect(() => {
    keyboardjs.bind(
      key,
      onPress,
      onRelease,
    )

    return () => {
      keyboardjs.unbind(key, onPress, onRelease)
    }
  }, [key, onPress, onRelease])
}

export function useKeyIsPressed<T extends string | string[]>(key: T): boolean {
  const [isPressed, setIsPressed] = useState(false)

  useKeyboard(
    key,
    () => setIsPressed(true),
    () => setIsPressed(false),
  )

  return isPressed
}
