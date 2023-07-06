import type { FC } from 'react'
import { memo } from 'react'
import { FormTitleSize, FormTitleWrapper } from './form-title.styles'

export { FormTitleSize }

type SizeValues = `${FormTitleSize}`

export interface FormTitleProps {
  size?: SizeValues
  style?: React.CSSProperties
  children: React.ReactNode
}

export const FormTitle: FC<FormTitleProps> = memo(({
  size = FormTitleSize.Normal,
  style,
  children,
}) => {
  return (
    <FormTitleWrapper style={style} $size={size}>
      {children}
    </FormTitleWrapper>
  )
})
