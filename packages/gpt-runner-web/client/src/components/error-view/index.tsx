import { type FC, memo } from 'react'
import { styled } from 'styled-components'

export interface ErrorViewProps {
  text: string
}

const ErrorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--panel-view-background);
  color: var(--foreground);
  user-select: text;
  text-align: center;
`

export const ErrorView: FC<ErrorViewProps> = memo((props) => {
  const { text } = props

  return (
    <ErrorWrapper>
      {text}
    </ErrorWrapper>
  )
})

ErrorView.displayName = 'ErrorView'
