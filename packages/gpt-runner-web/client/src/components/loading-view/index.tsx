import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react'
import type { FC } from 'react'
import { styled } from 'styled-components'

const LoadingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;
  position: relative;
`

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background: var(--panel-view-background);
  opacity: 0.5;
  width: 100%;
  height: 100%;
  z-index: -1;
`

export interface LoadingViewProps {
  style?: React.CSSProperties
  className?: string
  absolute?: boolean
  mask?: boolean
}

export const LoadingView: FC<LoadingViewProps> = (props) => {
  const { style, className, absolute, mask = true } = props

  const absoluteStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
  }

  const finalStyle = absolute ? { ...absoluteStyle, ...style } : style

  return (
    <LoadingWrapper style={finalStyle} className={className} onClick={(e: any) => {
      e.stopPropagation()
      return false
    }}>
      <VSCodeProgressRing />

      {mask && <Mask />}
    </LoadingWrapper>
  )
}

LoadingView.displayName = 'LoadingView'
