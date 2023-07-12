import { styled } from 'styled-components'

export const FileEditorWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`

export const EmptyEditorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--panel-view-background);
  color: var(--foreground);
  user-select: text;
  text-align: center;
`
