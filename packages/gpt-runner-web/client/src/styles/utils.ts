import { css } from 'styled-components'

export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const backDropBg = css`
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    backdrop-filter: var(--my-backdrop-filter);
    -webkit-backdrop-filter: var(--my-backdrop-filter);
    background: var(--my-backdrop-bg);
  }
`
