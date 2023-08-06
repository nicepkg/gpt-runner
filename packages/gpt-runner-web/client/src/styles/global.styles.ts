import { createGlobalStyle, styled } from 'styled-components'

export const GlobalStyle = createGlobalStyle<{ appendCss?: string }>`
  #root {
    width: 100%;
    height: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
    -webkit-user-drag: none;
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-family);

    --my-button-height: calc(var(--border-width) * 1px * 2 + var(--button-padding-vertical) * 2 + var(--type-ramp-base-font-size));
    --my-input-height: calc(var(--border-width) * 1px * 2 + var(--input-height) * 1px);
    --my-backdrop-filter: saturate(180%) blur(20px);
  }

  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;

    ::-webkit-scrollbar {
      width: 10px;
      background: transparent !important;
    }

    ::-webkit-scrollbar-track {
      background: transparent !important;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--my-scrollbar-bg);
      border-radius: 5px;
      transition: all 0.3s ease-in-out;

      &:hover {
        background: var(--my-scrollbar-hover-bg);
      }
    }
  }

  ${props => props.appendCss}
`

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`

export const FlexRowCenter = styled(FlexRow)`
  justify-content: center;
  align-items: center;
`

export const FlexColumnCenter = styled(FlexColumn)`
  justify-content: center;
  align-items: center;
`
