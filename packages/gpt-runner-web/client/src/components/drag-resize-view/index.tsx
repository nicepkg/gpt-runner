import type { FC } from 'react'
import { memo, useEffect, useMemo, useRef } from 'react'
import type { UserDragConfig } from '@use-gesture/react'
import { useDrag } from '@use-gesture/react'
import { motion, useMotionValue } from 'framer-motion'
import { DragLine } from './drag-resize-view.styles'

export type DragDirection = 'left' | 'right' | 'top' | 'bottom'
export interface DragDirectionConfig {
  direction: DragDirection
  /**
   * The boundary of the drag line.
   * The first element is the minimum value, the second element is the maximum value.
   */
  boundary: number[]
}
export interface DragResizeViewProps {
  initWidth?: number
  initHeight?: number
  dragConfig?: Omit<UserDragConfig, 'axis' | 'bounds'>
  dragDirectionConfigs: DragDirectionConfig[]
  style?: React.CSSProperties
  className?: string
  dragLineStyle?: React.CSSProperties
  dragLineClassName?: string
  dragLineColor?: string
  dragLineActiveColor?: string
  dragLineWidth?: string
  children: React.ReactNode
}

export const DragResizeView: FC<DragResizeViewProps> = memo((props) => {
  const {
    initWidth,
    initHeight,
    dragConfig,
    dragDirectionConfigs,
    style,
    className,
    dragLineClassName,
    dragLineStyle,
    dragLineColor = 'var(--panel-view-border)',
    dragLineActiveColor = 'var(--focus-border)',
    dragLineWidth = '1px',
    children,
  } = props

  const ref = useRef<HTMLDivElement>(null)
  const finalWidth = useMotionValue(initWidth)
  const finalHeight = useMotionValue(initHeight)

  useEffect(() => {
    if (initWidth === undefined)
      return
    finalWidth.set(initWidth)
  }, [initWidth])

  useEffect(() => {
    if (initHeight === undefined)
      return

    finalHeight.set(initHeight)
  }, [initHeight])

  const dragDirectionConfigMap = useMemo(() => {
    return dragDirectionConfigs.reduce((acc, config) => {
      acc[config.direction] = config
      return acc
    }, {} as Record<DragDirection, DragDirectionConfig>)
  }, [dragDirectionConfigs])

  useEffect(() => {
    const handleWindowResize = () => {
      if (ref.current) {
        finalWidth.set(ref.current.offsetWidth)
        finalHeight.set(ref.current.offsetHeight)
      }
    }

    window.addEventListener('resize', handleWindowResize)
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  const leftDragLingBind = useDrag(
    ({ offset }) => {
      if (initWidth === undefined)
        return
      finalWidth.set(initWidth - offset[0])
    },
    {
      rubberband: true,
      ...dragConfig,
      axis: 'x',
      bounds: {
        left: dragDirectionConfigMap?.left?.boundary?.[0] ?? 0,
        right: dragDirectionConfigMap?.left?.boundary?.[1] ?? 0,
      }, // Adjust the bounds as needed
    },
  )

  const rightDragLingBind = useDrag(
    ({ offset }) => {
      if (initWidth === undefined)
        return
      finalWidth.set(initWidth + offset[0])
    },
    {
      rubberband: true,
      ...dragConfig,
      axis: 'x',
      bounds: {
        left: dragDirectionConfigMap?.right?.boundary?.[0] ?? 0,
        right: dragDirectionConfigMap?.right?.boundary?.[1] ?? 0,
      }, // Adjust the bounds as needed
    },
  )

  const topDragLingBind = useDrag(
    ({ offset }) => {
      if (initHeight === undefined)
        return
      finalHeight.set(initHeight - offset[1])
    },
    {
      rubberband: true,
      ...dragConfig,
      axis: 'y',
      bounds: {
        top: dragDirectionConfigMap?.top?.boundary?.[0] ?? 0,
        bottom: dragDirectionConfigMap?.top?.boundary?.[1] ?? 0,
      }, // Adjust the bounds as needed
    },
  )

  const bottomDragLingBind = useDrag(
    ({ offset }) => {
      if (initHeight === undefined)
        return
      finalHeight.set(initHeight + offset[1])
    },
    {
      rubberband: true,
      ...dragConfig,
      axis: 'y',
      bounds: {
        top: dragDirectionConfigMap?.bottom?.boundary?.[0] ?? 0,
        bottom: dragDirectionConfigMap?.bottom?.boundary?.[1] ?? 0,
      }, // Adjust the bounds as needed
    },
  )

  const dragLineProps: React.HTMLAttributes<HTMLDivElement> = {
    style: dragLineStyle,
    className: dragLineClassName,
  }

  const dragLineBindMap: Record<DragDirection, ReturnType<typeof useDrag>> = {
    left: leftDragLingBind,
    right: rightDragLingBind,
    top: topDragLingBind,
    bottom: bottomDragLingBind,
  }

  return <motion.div
    className={className}
    style={{
      ...style,
      width: initWidth !== undefined ? finalWidth : '',
      height: finalHeight,
      position: 'relative',
    }} ref={ref}>
    {children}

    {Object.entries(dragLineBindMap).map(([direction, bind], index) => {
      return dragDirectionConfigMap[direction as DragDirection]
        ? <DragLine
          {...{
            ...dragLineProps,
            ...bind(),
          }}
          key={index}
          $dragLineColor={dragLineColor}
          $dragLineActiveColor={dragLineActiveColor}
          $dragLineWidth={dragLineWidth}
          data-direction={direction}
        ></DragLine>
        : null
    })}
  </motion.div>
})

DragResizeView.displayName = 'DragResizeView'
