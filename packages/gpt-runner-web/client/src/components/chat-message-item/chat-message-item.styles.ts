import { styled } from 'styled-components'

export const MsgWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: ${({ $isMe }) => $isMe ? 'row-reverse' : 'row'};
  margin-bottom: 1rem;
`

export const MsgAvatarWrapper = styled.div<{ $isMe: boolean; $showAvatar: boolean }>`
  display: ${({ $showAvatar }) => $showAvatar ? 'flex' : 'none'};
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin: 0 0.5rem;
  border: 1px solid var(--panel-view-border);
  align-self: flex-start;
`

export const MsgContentWrapper = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: ${({ $isMe }) => $isMe ? 'row-reverse' : 'row'};
  width: 100%;
  position: relative;
`

export const MsgContent = styled.div<{ $isMe: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  overflow: hidden;
  padding: 0.5rem;
  max-width: 100%;
  font-size: var(--type-ramp-base-font-size);
  border: 1px solid var(--panel-view-border);

  background: ${({ $isMe }) => $isMe
  ? 'linear-gradient(90deg, var(--list-hover-background) 0%, var(--panel-view-background) 100%)'
  : 'linear-gradient(-90deg, var(--list-hover-background) 0%, var(--panel-view-background) 100%)'};

  & .msg-content-footer {
    flex-wrap: wrap;
  }
`

export const MsgContentFooterWrapper = styled.div`
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;
  overflow: hidden;
`
