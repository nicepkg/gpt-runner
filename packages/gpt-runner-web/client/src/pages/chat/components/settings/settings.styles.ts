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
  overflow-x: auto;
  user-select: text;
  flex-shrink: 0;
  width: 100%;

  &:not(:last-child) {
    border-bottom: 1px solid var(--panel-view-border);
  }

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
  margin: 1rem;
  padding-left: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
  border-left: 0.25rem solid var(--foreground);
`
