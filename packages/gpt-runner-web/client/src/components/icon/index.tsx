import clsx from 'clsx'
import type { ComponentProps } from 'react'
import React, { forwardRef, memo } from 'react'

export interface IconProps extends ComponentProps<'span'> {
  onClick?: (e: React.MouseEvent) => void
}

export const Icon = memo(forwardRef<HTMLElement, IconProps>((props, ref) => {
  const { className, style, ...restProps } = props

  return (
    <span
      ref={ref}
      style={{
        fontSize: 'inherit',
        cursor: 'pointer',
        color: 'inherit',
        ...style,
      }}
      className={clsx(
        className,
        'codicon',
      )}
      {...restProps}
    />)
}))

Icon.displayName = 'Icon'
