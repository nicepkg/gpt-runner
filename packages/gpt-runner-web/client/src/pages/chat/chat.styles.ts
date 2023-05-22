import { css, styled } from 'styled-components'
import { withBreakpoint } from '../../helpers/with-breakpoint'

export const SidebarWrapper = styled.div`
  max-width: 300px;
  min-width: 200px;
  width: 40%;
  height: 100%;
  flex-shrink: 0;

  ${withBreakpoint('sm', css`
    max-width: 100%;
    width: 100%;
  `)}
`
