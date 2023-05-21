import clsx from 'clsx'
import type { ComponentProps, FC } from 'react'
import React from 'react'

export interface IconProps extends ComponentProps<'span'> {
  onClick?: (e: React.MouseEvent) => void
}

export const Icon: FC<IconProps> = (props) => {
  const { className, style, ...restProps } = props
  return (
    <span
      style={{
        fontSize: 'inherit',
        ...style,
      }}
      className={clsx(
        className,
        'codicon',
      )}
      {...restProps}
    />)
}
