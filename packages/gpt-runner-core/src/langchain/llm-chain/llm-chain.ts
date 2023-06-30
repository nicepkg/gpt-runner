import '../fixes'
import {
  ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { mapStoredMessageToChatTemplateMessages } from '../helper'
import type { GetLLMChainParams } from './type'
import { getLLM } from './get-llm'

export interface LLmChainParams extends GetLLMChainParams {}

export async function llmChain(params: LLmChainParams) {
  const {
    messages,
    systemPrompt,
  } = params

  const llm = getLLM(params)

  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(systemPrompt || 'You are a friendly assistant.'),
    ...mapStoredMessageToChatTemplateMessages(messages),
    HumanMessagePromptTemplate.fromTemplate('{global.input}'),
  ])

  const chain = new LLMChain({
    prompt: chatPrompt,
    llm,
  })

  return chain
}
