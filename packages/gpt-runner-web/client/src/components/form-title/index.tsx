import type { FC } from 'react'
import { memo } from 'react'
import { FormTitleWrapper } from './form-title.styles'

export interface FormTitleProps {
  style?: React.CSSProperties
  children: React.ReactNode
}

export const FormTitle: FC<FormTitleProps> = memo(({
  style,
  children,
}) => {
  return (
    <FormTitleWrapper style={style}>
      {children}
    </FormTitleWrapper>
  )
})
