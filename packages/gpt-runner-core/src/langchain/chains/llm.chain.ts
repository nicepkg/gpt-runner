import '../fixes'
import {
  ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate,
} from 'langchain/prompts'
import { LLMChain } from 'langchain/chains'
import { ChatRole } from '@nicepkg/gpt-runner-shared/common'
import { mapStoredMessageToChatTemplateMessages } from '../helper'
import type { GetModelParams } from './type'
import { getModel } from './get-model'

export interface LLMChainParams extends GetModelParams {}

export async function getLLMChain(params: LLMChainParams) {
  const {
    messages,
    systemPrompt,
    systemPromptAsUserPrompt,
  } = params

  const llm = getModel({ ...params, streaming: true })

  const DEFAULT_SYSTEM_PROMPT = 'You are a friendly assistant.'
  const finalMessages = [...messages || []]
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
