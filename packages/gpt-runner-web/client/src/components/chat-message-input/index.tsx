import type { FC } from 'react'
import { StyledVSCodeTextArea, ToolbarWrapper, Wrapper } from './chat-message-input.styles'

export interface ChatMessageInputProps {
  value: string
  toolbarSlot?: React.ReactNode
  onChange: (value: string) => void

}
export const ChatMessageInput: FC<ChatMessageInputProps> = (props) => {
  const { value = '', toolbarSlot, onChange } = props

  return <Wrapper>
    <ToolbarWrapper>
      {toolbarSlot}
    </ToolbarWrapper>
    <StyledVSCodeTextArea
      rows={10}
      value={value}
      onInput={(e: any) => {
        onChange(e.target?.value)
      }}
    />
  </Wrapper>
}
