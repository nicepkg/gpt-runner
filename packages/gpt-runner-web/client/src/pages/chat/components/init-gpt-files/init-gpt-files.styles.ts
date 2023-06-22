import { styled } from 'styled-components'

export const Wrapper = styled.div`
  position: fixed;
  background: var(--panel-view-background);
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1rem;
  align-items: center;
  justify-content: center;
`

export const Title = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
`

export const Badge = styled.span`
  margin: 0 0.5rem;
  padding: 0 0.5rem;
  display: inline;
  font-size: 1rem;
  background: var(--button-primary-background);
  color: var(--button-primary-foreground);
  border-radius: 0.25rem;
`
