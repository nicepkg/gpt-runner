import { styled } from 'styled-components'

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

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  margin: 1rem;
  position: relative;
`

export const StyledFormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  width: 100%;
`
