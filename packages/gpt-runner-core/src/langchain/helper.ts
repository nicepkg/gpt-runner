import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { AIMessagePromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import type { BaseMessageStringPromptTemplate } from 'langchain/dist/prompts/chat'
import type { BaseChatMessage } from 'langchain/schema'
import { AIChatMessage, HumanChatMessage, SystemChatMessage } from 'langchain/schema'

export function mapStoredMessagesToChatMessages(
  messages: SingleChatMessage[],
): BaseChatMessage[] {
  return messages.map((message) => {
    switch (message.name) {
      case ChatRole.User:
        return new HumanChatMessage(message.text)
      case ChatRole.ASSISTANT:
        return new AIChatMessage(message.text)
      case ChatRole.SYSTEM:
        return new SystemChatMessage(message.text)
      default:
        throw new Error('Role must be defined for generic messages')
    }
  })
}

export function mapStoredMessageToChatTemplateMessages(
  messages: SingleChatMessage[],
): BaseMessageStringPromptTemplate[] {
  return messages.map((message) => {
    switch (message.name) {
      case ChatRole.User:
        return HumanMessagePromptTemplate.fromTemplate(message.text)
      case ChatRole.ASSISTANT:
        return AIMessagePromptTemplate.fromTemplate(message.text)
      case ChatRole.SYSTEM:
        return SystemMessagePromptTemplate.fromTemplate(message.text)
      default:
        throw new Error('Role must be defined for generic messages')
    }
  })
}
