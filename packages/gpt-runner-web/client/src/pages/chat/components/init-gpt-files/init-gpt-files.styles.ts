import { VSCodeTag } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1rem;
  align-items: center;
  justify-content: center;
`

export const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

export const StyledVSCodeTag = styled(VSCodeTag)`
  margin: 0 0.5rem;

  &::part(control) {
    font-size: 1.1rem;
    text-transform: lowercase;
  }
`
