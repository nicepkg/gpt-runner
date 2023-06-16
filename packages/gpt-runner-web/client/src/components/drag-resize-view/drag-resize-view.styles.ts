import { styled } from 'styled-components'

export const DragLine = styled.div<{ $dragLineColor: string; $dragLineActiveColor: string; $dragLineWidth: string }>`
  position: absolute;
  background: ${({ $dragLineColor }) => $dragLineColor};
  /* z-index: 2; */
  touch-action: none;

  &:active {
    background: ${({ $dragLineActiveColor }) => $dragLineActiveColor};
  }

  &[data-direction='left'] {
    cursor: col-resize;
    width: ${({ $dragLineWidth }) => $dragLineWidth};
    left: 0;
    top: 0;
    bottom: 0;
  }

  &[data-direction='right'] {
    cursor: col-resize;
    width: ${({ $dragLineWidth }) => $dragLineWidth};
    right: 0;
    top: 0;
    bottom: 0;
  }

  &[data-direction='top'] {
    cursor: row-resize;
    height: ${({ $dragLineWidth }) => $dragLineWidth};
    top: 0;
    left: 0;
    right: 0;
  }

  &[data-direction='bottom'] {
    cursor: row-resize;
    height: ${({ $dragLineWidth }) => $dragLineWidth};
    bottom: 0;
    left: 0;
    right: 0;
  }
`
