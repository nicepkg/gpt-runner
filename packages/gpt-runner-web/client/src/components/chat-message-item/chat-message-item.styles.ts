import { css, styled } from 'styled-components'
import { withBreakpoint } from '../../helpers/with-breakpoint'
import type { MessageItemProps } from '.'

export const MsgWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: ${({ $isMe }) => $isMe ? 'row-reverse' : 'row'};
  margin-bottom: 1rem;
`

export const MsgAvatarWrapper = styled.div<{ $isMe: boolean }>`
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0 0.5rem;
  border: 1px solid var(--panel-view-border);
  align-self: ${({ $isMe }) => $isMe ? 'flex-end' : 'flex-start'};
`

export const MsgContentWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: ${({ $isMe }) => $isMe ? 'row-reverse' : 'row'};
  max-width: calc(100% - 6rem);
  width: 100%;
  position: relative;

  ${withBreakpoint('sm', css`
    max-width: 100%;
  `)}
`

export const MsgContent = styled.div<{ $showToolbar: MessageItemProps['showToolbar']; $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0.5rem;
  max-width: 100%;
  font-size: var(--type-ramp-base-font-size);
  background: var(--list-hover-background);

  &:hover {
    outline: 1px solid var(--panel-view-border);
  }

  & .msg-content-footer {
    flex-wrap: wrap;
  }

  ${({ $showToolbar, $isMe }) => ($showToolbar === 'hover'
? `
    position: absolute;
    top: 0;
    ${$isMe ? 'right' : 'left'}: 0;
    z-index: 1;
    min-height: 100%;

    & .msg-content-footer {
      opacity: 0;
      margin-top: 0;
      height: 0;
    }

    &:hover .msg-content-footer {
      opacity: 1;
      margin-top: 0.5rem;
      height: auto;
    }
  `
: $showToolbar === 'never'
? `
  & .msg-content-footer {
    display: none;
  }
`
: '')}
`

export const MsgContentFooterWrapper = styled.div`
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;
  overflow: hidden;
`
