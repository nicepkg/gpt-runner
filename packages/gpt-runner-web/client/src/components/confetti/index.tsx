import type { CSSProperties } from 'react'
import React, { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { useMouse } from '../../hooks/use-mouse.hook'
import { confetti } from './core'
import { ConfettiWrapper } from './confetti.styles'

export interface ConfettiRef {
  runConfettiAnime: () => void
}

export interface ConfettiProps {
  config?: {
    angle?: number
    spread?: number
    startVelocity?: number
    elementCount?: number
    decay?: number
    dragFriction?: number
    duration?: number
    stagger?: number
    width?: string
    height?: string
    colors?: string[]
    perspective?: string
    random?: () => number
  }
}

export const Confetti = memo(forwardRef<ConfettiRef, ConfettiProps>((props, ref) => {
  const { config = {} } = props
  const containerRef = useRef<HTMLDivElement>(null)
  const { x: mouseX, y: mouseY } = useMouse()
  const [applyStyles, setApplyStyles] = useState<CSSProperties>({})

  const runConfettiAnime = () => {
    if (containerRef.current) {
      // get mouse current position and set it to containerRef.current style
      const clientRect = containerRef.current.getBoundingClientRect()
      const { width, height } = clientRect

      setApplyStyles({
        top: `${mouseY - (height / 2)}px`,
        left: `${mouseX - (width / 2)}px`,
      })

      confetti(containerRef.current, config)
    }
  }

  useImperativeHandle(ref, () => ({
    runConfettiAnime,
  }), [runConfettiAnime])

  return <ConfettiWrapper>
    <div style={{
      position: 'absolute',
      ...applyStyles,
    }} ref={containerRef}></div>
  </ConfettiWrapper>
}))

Confetti.displayName = 'Confetti'
