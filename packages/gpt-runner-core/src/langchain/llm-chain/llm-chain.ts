import '../fixes'
import {
  ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { mapStoredMessageToChatTemplateMessages } from '../helper'
import type { GetLLMChainParams } from './type'
import { getLLM } from './get-llm'

export interface LLmChainParams extends GetLLMChainParams {}

export async function llmChain(params: LLmChainParams) {
  const {
    messages,
    systemPrompt,
    systemPromptAsUserPrompt,
  } = params

  const llm = getLLM(params)

  const DEFAULT_SYSTEM_PROMPT = 'You are a friendly assistant.'
  const finalMessages = [...messages]
  let finalSystemPrompt = systemPrompt || DEFAULT_SYSTEM_PROMPT

  if (systemPromptAsUserPrompt) {
    finalMessages.unshift({
      text: `Now I am user, you will answer my questions as follows setup or role play: \n\n${finalSystemPrompt}`,
      name: ChatRole.User,
    }, {
      text: 'Ok',
      name: ChatRole.Assistant,
    })
    finalSystemPrompt = DEFAULT_SYSTEM_PROMPT
  }

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(finalSystemPrompt),
    ...mapStoredMessageToChatTemplateMessages(finalMessages),
    HumanMessagePromptTemplate.fromTemplate('{global.input}'),
  ])

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm,
  })

  return chain
}
