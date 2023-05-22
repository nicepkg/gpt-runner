import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'

function cubicBezier(t: number) {
  return 3 * (1 - t) * t ** 2 * 0.7 + t ** 3
}

export const IndeterminateProgressBar: FC = () => {
  const indicatorRef = useRef<HTMLDivElement>(null)

  const shortLength = 20
  const longLength = 50
  const lengthRatio = 100 + shortLength + longLength

  const duration = 2.1 * 1e3

  const controls = useAnimation()

  useEffect(() => {
    const animateIndicator = async () => {
      await controls.start({
        x: ['0%', `${100 + lengthRatio}%`],
        transition: {
          duration: duration / 1000,
          ease: (t: number) => cubicBezier(t),
          loop: Infinity,
        },
      })
    }

    animateIndicator()
  }, [controls])

  return (
    <div
      style={{
        flex: 1,
        width: '100%',
        height: '2px',
        position: 'relative',
      }}
    >
      <motion.div
        ref={indicatorRef}
        animate={controls}
        style={{
          position: 'absolute',
          width: `${lengthRatio}%`,
          height: '100%',
          top: 0,
          left: `-${lengthRatio}%`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            background: 'var(--progressBar-background)',
            width: `${(longLength / lengthRatio) * 100}%`,
            height: '100%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            background: 'var(--progressBar-background)',
            width: `${(shortLength / lengthRatio) * 100}%`,
            height: '100%',
            right: 0,
          }}
        />
      </motion.div>
    </div>
  )
}
