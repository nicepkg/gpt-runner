import { styled } from 'styled-components'
import { Logo } from '../../../../../../components/logo'

export const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: text;
  flex-shrink: 0;
  width: 100%;
  padding: 1rem;
`

export const StyledLogo = styled(Logo)`
  flex-shrink: 0;
  width: auto;
  height: 3rem;
  max-width: 100%;
  margin: 0 auto;
`

export const List = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  border: 1px solid var(--panel-view-border);
  width: 100%;
  border-radius: 0.25rem;
  overflow: hidden;
`

export const ListItem = styled.div`
  flex-shrink: 0;
  border-top: 1px solid var(--panel-view-border);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:first-child {
    border-top: none;
  }
`

export const Title = styled.div`
  flex-shrink: 0;
  font-weight: bold;
`

export const Content = styled.div`
`
