import { VSCodeButton } from '@vscode/webview-ui-toolkit/react'
import { styled } from 'styled-components'

export const StyledVSCodeButton = styled(VSCodeButton)<{ $hoverShowText?: boolean }>`
  ${({ $hoverShowText }) => ($hoverShowText
  ? `
  & .icon-button-text {
    opacity: 0;
    width: 0px;
    margin-left: 0px;
  }
  &:hover .icon-button-text {
    opacity: 1;
    width: auto;
    margin-left: 0.5rem;
  }
  `
: '')}
`

export const Text = styled.div`
  transition: all 0.2s ease-in-out;
  margin-left: 0.5rem;
  overflow: hidden;
  font-size: var(--type-ramp-base-font-size);
  line-height: var(--type-ramp-base-font-size);
  color: var(--foreground);
  white-space: nowrap;
`
