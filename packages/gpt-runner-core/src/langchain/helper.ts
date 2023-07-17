import type { SingleChatMessage } from '@nicepkg/gpt-runner-shared/common'
import { ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { AIMessagePromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import type { BaseMessageStringPromptTemplate } from 'langchain/dist/prompts/chat'
import type { BaseMessage } from 'langchain/schema'
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema'

export function mapStoredMessagesToChatMessages(
  messages: SingleChatMessage[],
): BaseMessage[] {
  return messages.map((message) => {
    switch (message.name) {
      case ChatRole.User:
        return new HumanMessage(message.text)
      case ChatRole.Assistant:
        return new AIMessage(message.text)
      case ChatRole.System:
        return new SystemMessage(message.text)
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
      case ChatRole.Assistant:
        return AIMessagePromptTemplate.fromTemplate(message.text)
      case ChatRole.System:
        return SystemMessagePromptTemplate.fromTemplate(message.text)
      default:
        throw new Error('Role must be defined for generic messages')
    }
  })
}
