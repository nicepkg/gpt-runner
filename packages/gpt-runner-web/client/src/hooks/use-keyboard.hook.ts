// useKeyboard.ts
import { useEffect } from 'react'
import type { Callback } from 'keyboardjs'
import keyboardjs from 'keyboardjs'

export function useKeyboard(key: string, onPress: Callback, onRelease?: Callback): void {
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
