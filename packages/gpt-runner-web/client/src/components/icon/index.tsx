import clsx from 'clsx'
import type { ComponentProps, FC } from 'react'
import React, { memo } from 'react'

export interface IconProps extends ComponentProps<'span'> {
  onClick?: (e: React.MouseEvent) => void
}

export const Icon: FC<IconProps> = memo((props) => {
  const { className, style, ...restProps } = props
  return (
    <span
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
})

Icon.displayName = 'Icon'
