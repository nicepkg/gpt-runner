import type { BaseLanguageModel } from 'langchain/dist/base_language'
import { ChatModelType } from '@nicepkg/gpt-runner-shared/common'
import type { GetLLMChainParams } from './type'
import { getAnthropicLLM } from './models/anthropic.model'
import { getHuggingFaceLLM } from './models/hugging-face.model'
import { getOpenaiLLM } from './models/openai.model'

export function getLLM(params: GetLLMChainParams): BaseLanguageModel {
  const getLLMFns: ((params: GetLLMChainParams) => BaseLanguageModel | null)[] = [
    getAnthropicLLM,
    getHuggingFaceLLM,
    getOpenaiLLM,
  ]

  if (!params.model.type) {
    Object.assign(params.model, {
      type: ChatModelType.Openai,
    })
  }

  for (const getLLMFn of getLLMFns) {
    const llm = getLLMFn(params)
    if (llm)
      return llm
  }

  throw new Error(`No LLM provided, model type ${params.model.type}`)
}
