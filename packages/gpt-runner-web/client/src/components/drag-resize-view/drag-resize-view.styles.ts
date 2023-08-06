import { styled } from 'styled-components'

// actual line weight is 8px, because we need to make it bigger to make it easier to grab
const lineWeight = '8px'

export const DragLine = styled.div<{ $dragLineColor: string; $dragLineActiveColor: string; $dragLineWidth: string }>`
  position: absolute;
  z-index: 10;
  /* background: ${({ $dragLineColor }) => $dragLineColor}; */
  border-color: ${({ $dragLineColor }) => $dragLineColor};
  border-style: solid;
  border-width: 0;
  touch-action: none;

  &:active {
    /* background: ${({ $dragLineActiveColor }) => $dragLineActiveColor}; */
    border-color: ${({ $dragLineActiveColor }) => $dragLineActiveColor};
  }

  &[data-direction='left'] {
    cursor: col-resize;
    width: ${lineWeight};
    border-left-width: ${({ $dragLineWidth }) => $dragLineWidth};
    left: 0;
    top: 0;
    bottom: 0;
  }

  &[data-direction='right'] {
    cursor: col-resize;
    width:  ${lineWeight};
    border-right-width: ${({ $dragLineWidth }) => $dragLineWidth};
    right: 0;
    top: 0;
    bottom: 0;
  }

  &[data-direction='top'] {
    cursor: row-resize;
    height:  ${lineWeight};
    border-top-width: ${({ $dragLineWidth }) => $dragLineWidth};
    top: 0;
    left: 0;
    right: 0;
  }

  &[data-direction='bottom'] {
    cursor: row-resize;
    height: ${lineWeight};
    border-bottom-width: ${({ $dragLineWidth }) => $dragLineWidth};
    bottom: 0;
    left: 0;
    right: 0;
  }
`
