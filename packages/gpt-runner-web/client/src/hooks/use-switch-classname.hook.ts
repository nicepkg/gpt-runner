import { useCallback, useEffect, useRef } from 'react'

export interface UseSwitchClassNameProps {
  selector: string
  className?: string
}

export function useSwitchClassName(props: UseSwitchClassNameProps): (newClassName: string) => void {
  const { selector, className } = props
  const previousClassName = useRef<string | null>(null)

  useEffect(() => {
    const element = document.querySelector(selector)

    if (element) {
      if (previousClassName.current)
        element.classList.remove(previousClassName.current)

      element.classList.add(className || '')
      previousClassName.current = className || ''
    }

    return () => {
      if (element && previousClassName.current)
        element.classList.remove(previousClassName.current)
    }
  }, [selector, className])

  const switchClassName = useCallback(
    (newClassName: string) => {
      const element = document.querySelector(selector)

      if (element) {
        if (previousClassName.current)
          element.classList.remove(previousClassName.current)

        element.classList.add(newClassName)
        previousClassName.current = newClassName
      }
    },
    [selector],
  )

  return switchClassName
}
