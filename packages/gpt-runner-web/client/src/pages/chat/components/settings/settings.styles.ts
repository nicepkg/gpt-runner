import { styled } from 'styled-components'

export const SettingsWrapper = styled.div`
  width: calc(100vw - 2rem);
  height: 50vh;
  background: var(--panel-view-background);
  padding-bottom: 0.5rem;
  max-width: 500px;
`

export const ConfigInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  user-select: text;

  & .msg-code-block {
    margin: 0;

    & > pre {
      margin: 0 !important;
    }
  }

  code {
    white-space: pre-wrap !important;
  }
`

export const ConfigInfoTitle = styled.div`
  margin-top: 0.5rem;
  padding: 0 1rem;
`
