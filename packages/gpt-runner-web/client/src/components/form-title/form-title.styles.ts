import styled from 'styled-components'
import type { CSSProperties } from 'react'

export enum FormTitleSize {
  Normal = 'normal',
  Large = 'large',
}

const sizeFontSizeMap: Record<FormTitleSize, CSSProperties['fontSize']> = {
  [FormTitleSize.Normal]: '1rem',
  [FormTitleSize.Large]: '1.2rem',
}

export const FormTitleWrapper = styled.div<{ $size: `${FormTitleSize}` }>`
  padding-left: 0.5rem;
  margin: 1rem;
  margin-bottom: 0;
  font-size: ${({ $size }) => sizeFontSizeMap[$size]};
  font-weight: bold;
  border-left: 0.25rem solid var(--foreground);
`
