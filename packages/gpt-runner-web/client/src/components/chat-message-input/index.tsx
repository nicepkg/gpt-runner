import { type FC, memo } from 'react'
import { LogoWrapper, StyledLogo, StyledVSCodeTextArea, TextAreaWrapper, ToolbarWrapper, Wrapper } from './chat-message-input.styles'

export interface ChatMessageInputProps {
  value: string
  toolbarSlot?: React.ReactNode
  showTopLogo?: boolean
  showBottomLogo?: boolean
  onChange: (value: string) => void
}
export const ChatMessageInput: FC<ChatMessageInputProps> = memo((props) => {
  const { value = '', toolbarSlot, showTopLogo = false, showBottomLogo = false, onChange } = props

  return <Wrapper style={{
    paddingBottom: showBottomLogo ? 'unset' : 0,
  }}>
    <ToolbarWrapper>
      {toolbarSlot}

      {showTopLogo && <LogoWrapper>
        <StyledLogo color={'var(--panel-tab-foreground)'}></StyledLogo>
      </LogoWrapper>}
    </ToolbarWrapper>

    <TextAreaWrapper>
      <StyledVSCodeTextArea
        rows={10}
        value={value}
        onInput={(e: any) => {
          onChange(e.target?.value)
        }}
      >
      </StyledVSCodeTextArea>
    </TextAreaWrapper>

    {showBottomLogo && <LogoWrapper style={{ position: 'static' }}>
      <StyledLogo color={'var(--panel-tab-foreground)'}></StyledLogo>
    </LogoWrapper>}
  </Wrapper>
})

ChatMessageInput.displayName = 'ChatMessageInput'
