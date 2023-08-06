import { css, styled } from 'styled-components'

export const ButtonWrapper = styled.div<{ $transparentBgWhenNotHover: boolean; $hoverShowText?: boolean }>`
  display: flex;
  flex-shrink: 0;
  overflow: hidden;

  vscode-button {
    &:not(:hover) {
      background: ${({ $transparentBgWhenNotHover }) => ($transparentBgWhenNotHover ? 'transparent' : '')};
    }

    /* &::part(control) {
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    } */
  }

  ${({ $hoverShowText }) => ($hoverShowText
  ? css`
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

  & + .icon-button {
      padding-left: 0.5rem;
  }
`

export const Text = styled.div`
  transition: all 0.1s ease-in-out;
  margin-left: 0.5rem;
  overflow: hidden;
  font-size: var(--type-ramp-base-font-size);
  line-height: var(--type-ramp-base-font-size);
  color: var(--foreground);
  white-space: nowrap;
`
