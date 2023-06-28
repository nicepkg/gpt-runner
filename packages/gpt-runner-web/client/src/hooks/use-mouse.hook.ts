import { useEffect, useState } from 'react'

interface MousePosition {
  x: number
  y: number
}

export function useMouse() {
  const [mouse, setMouse] = useState<MousePosition>({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', onMouseMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return mouse
}
